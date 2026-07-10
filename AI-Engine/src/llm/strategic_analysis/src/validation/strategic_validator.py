import yaml
from pathlib import Path
from typing import Dict, Any, Tuple, List
from llm.shared.validation.grounding_validator import GroundingValidator
from llm.shared.validation.output_validator import OutputValidator
from llm.shared.schemas.evidence import EvidencePack
from ..schemas.strategic_schema import StrategicAnalysisResult


class StrategicValidator:
    """
    Orchestrates validation specifically for the Strategic Analysis outputs.
    Combines structural validation, confidence limits, and grounding tests.
    """

    def __init__(self, thresholds_path: str = None):
        if not thresholds_path:
            # Default lookup relative to base configs
            thresholds_path = str(Path(__file__).resolve().parents[2] / "configs" / "thresholds.yaml")
            
        self.thresholds = self._load_thresholds(thresholds_path)

    def _load_thresholds(self, path: str) -> Dict[str, Any]:
        try:
            with open(path, "r", encoding="utf-8") as f:
                config = yaml.safe_load(f)
            return config.get("validation_thresholds", {})
        except Exception:
            # Fallback defaults
            return {
                "min_claim_confidence": 0.70,
                "min_recommendation_confidence": 0.65,
                "grounding_rate_threshold": 1.0,
                "evidence_coverage_warning_threshold": 0.30
            }

    def validate_analysis(
        self,
        analysis: StrategicAnalysisResult,
        evidence_pack: EvidencePack
    ) -> Tuple[bool, Dict[str, Any]]:
        """
        Validate a generated strategic analysis.
        """
        errors: List[str] = []
        warnings: List[str] = []
        
        # 1. Compile all claims for Grounding Validation
        all_claims = []
        
        # SWOT
        all_claims.extend(analysis.swot.strengths)
        all_claims.extend(analysis.swot.weaknesses)
        all_claims.extend(analysis.swot.opportunities)
        all_claims.extend(analysis.swot.threats)
        
        # Market gaps
        all_claims.extend(analysis.market_gaps)
        
        # Recommended actions
        all_claims.extend(analysis.recommended_actions)
        
        # Run grounding check
        grounding_passed, grounding_report = GroundingValidator.validate_grounding(all_claims, evidence_pack)
        
        # 2. Check confidence thresholds
        min_claim_conf = self.thresholds.get("min_claim_confidence", 0.70)
        min_rec_conf = self.thresholds.get("min_recommendation_confidence", 0.65)
        
        for c in all_claims:
            claim_type_str = c.claim_type.value if hasattr(c.claim_type, "value") else str(c.claim_type)
            if claim_type_str == "RECOMMENDATION":
                if c.confidence < min_rec_conf:
                    warnings.append(
                        f"Recommendation '{c.statement[:30]}...' confidence ({c.confidence}) is below target threshold ({min_rec_conf})."
                    )
            else:
                if c.confidence < min_claim_conf:
                    warnings.append(
                        f"Claim '{c.statement[:30]}...' confidence ({c.confidence}) is below target threshold ({min_claim_conf})."
                    )

        # 3. Rule Checks: Recommended actions should be labeled as RECOMMENDATION
        for rec in analysis.recommended_actions:
            rec_type = rec.claim_type.value if hasattr(rec.claim_type, "value") else str(rec.claim_type)
            if rec_type != "RECOMMENDATION":
                errors.append(f"Recommended action '{rec.statement[:30]}' must have claim_type 'RECOMMENDATION', not '{rec_type}'.")

        # 4. Grounding rate pass/fail criteria
        target_grounding_rate = self.thresholds.get("grounding_rate_threshold", 1.0)
        actual_grounding_rate = grounding_report.get("grounding_rate", 0.0)
        if actual_grounding_rate < target_grounding_rate:
            errors.append(f"Grounding rate ({actual_grounding_rate}) is below required threshold ({target_grounding_rate}).")

        # 5. Coverage warn checks
        target_coverage = self.thresholds.get("evidence_coverage_warning_threshold", 0.30)
        actual_coverage = grounding_report.get("evidence_coverage_rate", 0.0)
        if actual_coverage < target_coverage:
            warnings.append(f"Low evidence coverage: only {actual_coverage * 100}% of supplied evidence was referenced in the analysis.")

        passed = len(errors) == 0 and grounding_passed
        
        report = {
            "passed": passed,
            "errors": errors,
            "warnings": warnings,
            "grounding": grounding_report,
            "thresholds_used": self.thresholds
        }
        
        return passed, report
