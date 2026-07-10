"""
Benchmark runner for evaluating change detection accuracy
"""
import json
import time
import yaml
from pathlib import Path
from src.pipelinde.etector import HybridChangeDetector

class BenchmarkRunner:
    """Run benchmarks and evaluate performance"""
    
    def __init__(self, config_path: str, fixtures_dir: str, expected_dir: str):
        """Initialize benchmark runner"""
        with open(config_path, 'r') as f:
            config = yaml.safe_load(f)
        
        self.detector = HybridChangeDetector(config)
        self.fixtures_dir = Path(fixtures_dir)
        self.expected_dir = Path(expected_dir)
    
    def load_fixture(self, name: str) -> dict:
        """Load test fixture"""
        fixture_path = self.fixtures_dir / f"{name}.json"
        with open(fixture_path, 'r') as f:
            return json.load(f)
    
    def load_expected(self, name: str) -> dict:
        """Load expected results"""
        expected_path = self.expected_dir / f"{name}_expected.json"
        with open(expected_path, 'r') as f:
            return json.load(f)
    
    def evaluate_result(self, result: dict, expected: dict) -> dict:
        """Evaluate result against expected"""
        metrics = {
            'total_detected': result['total_changes'],
            'total_expected': expected['total_changes'],
            'processing_time_ms': result['processing_time_ms']
        }
        
        # Calculate precision/recall
        detected_types = set(c['change_type'] for c in result['changes'])
        expected_types = set(c['change_type'] for c in expected['changes'])
        
        true_positives = len(detected_types & expected_types)
        false_positives = len(detected_types - expected_types)
        false_negatives = len(expected_types - detected_types)
        
        precision = true_positives / (true_positives + false_positives) if true_positives + false_positives > 0 else 0
        recall = true_positives / (true_positives + false_negatives) if true_positives + false_negatives > 0 else 0
        f1 = 2 * (precision * recall) / (precision + recall) if precision + recall > 0 else 0
        
        metrics['precision'] = precision
        metrics['recall'] = recall
        metrics['f1_score'] = f1
        
        return metrics
    
    def run_benchmark(self, fixture_name: str) -> dict:
        """Run a single benchmark"""
        print(f"Running benchmark: {fixture_name}")
        
        fixture = self.load_fixture(fixture_name)
        expected = self.load_expected(fixture_name)
        
        # Run detection
        start = time.time()
        result = self.detector.detect(fixture['old'], fixture['new'])
        elapsed = (time.time() - start) * 1000
        result['processing_time_ms'] = elapsed
        
        # Evaluate
        metrics = self.evaluate_result(result, expected)
        
        return {
            'fixture_name': fixture_name,
            'metrics': metrics,
            'result': result
        }
    
    def run_all_benchmarks(self):
        """Run all benchmarks"""
        fixtures = [
            'pricing_changes',
            'feature_changes',
            'security_changes',
            'mixed_changes'
        ]
        
        results = []
        
        for fixture in fixtures:
            try:
                result = self.run_benchmark(fixture)
                results.append(result)
                
                print(f"  ✓ Precision: {result['metrics']['precision']:.2%}")
                print(f"  ✓ Recall: {result['metrics']['recall']:.2%}")
                print(f"  ✓ F1: {result['metrics']['f1_score']:.2%}")
                print(f"  ✓ Time: {result['metrics']['processing_time_ms']:.1f}ms")
                print()
            except Exception as e:
                print(f"  ✗ Failed: {e}")
                print()
        
        return results


if __name__ == '__main__':
    runner = BenchmarkRunner(
        config_path='configs/base.yaml',
        fixtures_dir='benchmarks/fixtures',
        expected_dir='benchmarks/expected'
    )
    
    results = runner.run_all_benchmarks()
    
    # Save results
    with open('artifacts/benchmark-results/results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("Benchmark complete!")
