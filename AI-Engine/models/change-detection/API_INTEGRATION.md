# API Integration Guide

## FastAPI Integration

### 1. Create API Endpoint

```python
# api/change_detection.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import yaml
from pathlib import Path

# Import from change-detection
from models.change_detection.src.pipeline.detector import HybridChangeDetector
from models.change_detection.src.schemas.snapshot import Snapshot

router = APIRouter(prefix="/api/v1", tags=["change-detection"])

# Load config once at startup
config_path = Path(__file__).parent.parent / "models/change-detection/configs/base.yaml"
with open(config_path, 'r') as f:
    config = yaml.safe_load(f)

detector = HybridChangeDetector(config)


class DetectionRequest(BaseModel):
    old_snapshot: dict
    new_snapshot: dict


class DetectionResponse(BaseModel):
    result_id: str
    competitor_id: str
    change_detected: bool
    total_changes: int
    changes: list
    processing_time_ms: float
    severity_summary: dict


@router.post("/changes/detect", response_model=DetectionResponse)
async def detect_changes(request: DetectionRequest):
    """
    Detect changes between two competitor snapshots
    
    Args:
        old_snapshot: Previous snapshot
        new_snapshot: Current snapshot
    
    Returns:
        Change detection result
    """
    try:
        result = detector.detect(
            request.old_snapshot,
            request.new_snapshot
        )
        
        return DetectionResponse(**result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/changes/batch")
async def batch_detect(snapshot_pairs: list):
    """
    Detect changes for multiple snapshot pairs
    """
    try:
        results = detector.batch_detect(snapshot_pairs)
        return {"results": results, "total_pairs": len(snapshot_pairs)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 2. Register in Main App

```python
# src/app.ts (backend)
from fastapi import FastAPI
from api.change_detection import router as cd_router

app = FastAPI()

# Register change detection routes
app.include_router(cd_router)

# In your existing setup...
```

### 3. Client Usage

```typescript
// Frontend example
const detectChanges = async (oldSnapshot: any, newSnapshot: any) => {
  const response = await fetch('/api/v1/changes/detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      old_snapshot: oldSnapshot,
      new_snapshot: newSnapshot
    })
  })
  
  return response.json()
}

// Example usage
const result = await detectChanges(
  { competitor_id: 'stripe', raw_data: {...} },
  { competitor_id: 'stripe', raw_data: {...} }
)

console.log(result.changes) // List of detected changes
console.log(result.severity_summary) // { CRITICAL: 1, HIGH: 2, ... }
```

## Database Integration (Prisma)

### 1. Schema Extensions

```prisma
// prisma/schema.prisma

model ChangeDetectionResult {
  id                String    @id @default(cuid())
  resultId          String    @unique
  competitorId      String
  oldSnapshotId     String
  newSnapshotId     String
  changeDetected    Boolean
  totalChanges      Int
  processingTimeMs  Float
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  changes           Change[]
  severity          ChangeResultSeverity
}

model Change {
  id                String    @id @default(cuid())
  changeId          String
  resultId          String
  result            ChangeDetectionResult @relation(fields: [resultId], references: [id], onDelete: Cascade)
  
  changeType        String
  entity            String?
  oldValue          String?
  newValue          String?
  importanceScore   Float
  confidenceScore   Float
  severity          String
  detectionMethod   String
  
  createdAt         DateTime  @default(now())
  
  @@index([resultId])
}

enum ChangeResultSeverity {
  CRITICAL
  HIGH
  MEDIUM
  LOW
  INFO
}
```

### 2. Migrations

```bash
npx prisma migrate dev --name add_change_detection
```

### 3. Repository

```typescript
// src/repositories/changeDetectionRepository.ts
import { db } from '@/config/db'

export const changeDetectionRepository = {
  async saveResult(result: any) {
    return db.changeDetectionResult.create({
      data: {
        resultId: result.result_id,
        competitorId: result.competitor_id,
        oldSnapshotId: result.old_snapshot_id,
        newSnapshotId: result.new_snapshot_id,
        changeDetected: result.change_detected,
        totalChanges: result.total_changes,
        processingTimeMs: result.processing_time_ms,
        changes: {
          createMany: {
            data: result.changes.map((change: any) => ({
              changeId: change.change_id,
              changeType: change.change_type,
              entity: change.entity,
              oldValue: change.old_value,
              newValue: change.new_value,
              importanceScore: change.importance_score,
              confidenceScore: change.confidence_score,
              severity: change.severity,
              detectionMethod: change.detection_method
            }))
          }
        }
      },
      include: { changes: true }
    })
  },
  
  async getResultById(resultId: string) {
    return db.changeDetectionResult.findUnique({
      where: { resultId },
      include: { changes: true }
    })
  },
  
  async getResultsByCompetitor(competitorId: string) {
    return db.changeDetectionResult.findMany({
      where: { competitorId },
      include: { changes: true },
      orderBy: { createdAt: 'desc' }
    })
  }
}
```

## Service Layer

```typescript
// src/services/changeDetectionService.ts
import { changeDetectionRepository } from '@/repositories/changeDetectionRepository'

export const changeDetectionService = {
  async detectAndSave(oldSnapshot: any, newSnapshot: any) {
    // This will be called from your backend
    // The Python detector runs and returns results
    
    const result = await fetch('http://localhost:8000/api/v1/changes/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        old_snapshot: oldSnapshot,
        new_snapshot: newSnapshot
      })
    })
    
    const detectionResult = await result.json()
    
    // Save to database
    const saved = await changeDetectionRepository.saveResult(detectionResult)
    
    return saved
  },
  
  async getCriticalChanges(competitorId: string) {
    const results = await changeDetectionRepository.getResultsByCompetitor(competitorId)
    
    return results
      .flatMap(r => r.changes)
      .filter(c => c.severity === 'CRITICAL')
      .sort((a, b) => b.importanceScore - a.importanceScore)
  }
}
```

## Background Job Integration

```typescript
// src/jobs/changeDetectionJob.ts
import Bull from 'bull'
import { changeDetectionService } from '@/services/changeDetectionService'

const changeDetectionQueue = new Bull('change-detection')

changeDetectionQueue.process(async (job) => {
  const { oldSnapshot, newSnapshot } = job.data
  
  try {
    const result = await changeDetectionService.detectAndSave(
      oldSnapshot,
      newSnapshot
    )
    
    // Publish event for subscribers
    await publishEvent('changes.detected', {
      competitorId: result.competitorId,
      changes: result.changes,
      timestamp: new Date()
    })
    
    return result
  } catch (error) {
    console.error('Change detection failed:', error)
    throw error
  }
})

// Retry on failure
changeDetectionQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err)
  // Retry after 1 minute
  job.retry()
})

export { changeDetectionQueue }
```

## Real-time Updates via WebSocket

```typescript
// Frontend: Subscribe to changes
socket.on('changes:detected', (data) => {
  console.log('New changes detected:', data)
  // Update UI
  updateCompetitorChanges(data.competitorId, data.changes)
})

// Backend: Emit on detection complete
io.emit('changes:detected', {
  competitorId: result.competitor_id,
  changes: result.changes,
  severity_summary: result.severity_summary
})
```

## Performance Optimization

### 1. Batch Processing

```python
# Process multiple competitors in parallel
from concurrent.futures import ThreadPoolExecutor

snapshot_pairs = [...]  # List of (old, new) pairs
results = detector.batch_detect(snapshot_pairs)
```

### 2. Caching

```python
# Cache results for 24 hours
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def get_changes(old_hash: str, new_hash: str):
    """Get cached results"""
    # ...
```

### 3. Rate Limiting

```typescript
// Frontend rate limiting
const DETECTION_COOLDOWN = 5 * 60 * 1000 // 5 minutes

let lastDetection = 0

export const detectChanges = async (old: any, new: any) => {
  const now = Date.now()
  if (now - lastDetection < DETECTION_COOLDOWN) {
    return // Skip if too soon
  }
  
  lastDetection = now
  // Run detection
}
```

## Monitoring & Logging

```python
# Add monitoring to detector
from datetime import datetime

class MonitoredDetector:
    def detect(self, old, new):
        start = datetime.now()
        
        try:
            result = self.detector.detect(old, new)
            duration = (datetime.now() - start).total_seconds()
            
            # Log metrics
            logger.info({
                'event': 'change_detection_complete',
                'duration_ms': duration,
                'changes_detected': result['total_changes'],
                'competitor_id': result['competitor_id']
            })
            
            return result
        
        except Exception as e:
            logger.error({
                'event': 'change_detection_failed',
                'error': str(e),
                'competitor_id': old.get('competitor_id')
            })
            raise
```

## Alerts & Notifications

```typescript
// Alert on critical changes
const handleChangesDetected = async (changes: Change[]) => {
  const critical = changes.filter(c => c.severity === 'CRITICAL')
  
  if (critical.length > 0) {
    // Send alert
    await alertService.send({
      level: 'critical',
      message: `${critical.length} critical changes detected`,
      changes: critical
    })
  }
}
```

---

**Next Steps:**
1. Install dependencies
2. Configure API endpoints
3. Test with sample snapshots
4. Deploy to production
5. Monitor performance
6. Fine-tune thresholds based on results
