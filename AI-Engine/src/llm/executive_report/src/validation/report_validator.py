import yaml
from pathlib import Path
from typing import Dict, Any, Tuple, List
from llm.shared.validation.grounding_validator import GroundingValidator
from llm.shared.schemas.evidence import EvidencePack
from ..schemas.report_schema import ExecutiveReportResult


class ExecutiveReportValidator:
    """
    Quality validator specifically for the Executive Report output.
    Ensures clear structure, confidence levels, and 100% grounding.
    """

    def __init__(self, thresholds_path: str = None):
        if not thresholds_path:
            thresholds_path = str(Path(__file__).resolve().parents[2] / "configs" / "thresholds.yaml")
        self.thresholds = self._load_thresholds(thresholds_path)

    def _load_thresholds(self, path: str) -> Dict[str, Any]:
        try:
            with open(path, "r", encoding="utf-8") as f:
                config = yaml.safe_load(f)
            return config.get("validation_thresholds", {})
        except Exception:
            return {
                "min_development_confidence": 0.70,
                "min_risk_confidence": 0.70,
                "min_action_confidence": 0.65,
                "grounding_rate_threshold": 1.0
            }

    def validate_report(
        self,
        report: ExecutiveReportResult,
        evidence_pack: EvidencePack
    ) -> Tuple[bool, Dict[str, Any]]:
        """
        Validate a generated executive report.
        """
        errors: List[str] = []
        warnings: List[str] = []
        
        # 1. Compile all claims for grounding analysis
        all_claims = []
        all_claims.extend(report.key_developments)
        all_claims.extend(report.strategic_risks)
        all_claims.extend(report.opportunities)
        all_claims.extend(report.recommended_actions)
        
        # Grounding check
        grounding_passed, grounding_report = GroundingValidator.validate_grounding(all_claims, evidence_pack)
        
        # 2. Check confidence thresholds
        min_dev_conf = self.thresholds.get("min_development_confidence", 0.70)
        min_risk_conf = self.thresholds.get("min_risk_confidence", 0.70)
        min_act_conf = self.thresholds.get("min_action_confidence", 0.65)
        
        for dev in report.key_developments:
            if dev.confidence < min_dev_conf:
                warnings.append(f"Development '{dev.statement[:30]}' confidence ({dev.confidence}) below threshold ({min_dev_conf}).")
                
        for risk in report.strategic_risks:
            if risk.confidence < min_risk_conf:
                warnings.append(f"Risk '{risk.statement[:30]}' confidence ({risk.confidence}) below threshold ({min_risk_conf}).")
                
        for action in report.recommended_actions:
            if action.confidence < min_act_conf:
                warnings.append(f"Action '{action.statement[:30]}' confidence ({action.confidence}) below threshold ({min_act_conf}).")

        # 3. Grounding Rate threshold validation
        target_grounding_rate = self.thresholds.get("grounding_rate_threshold", 1.0)
        actual_grounding_rate = grounding_report.get("grounding_rate", 0.0)
        if actual_grounding_rate < target_grounding_rate:
            errors.append(f"Grounding rate ({actual_grounding_rate}) is below required threshold ({target_grounding_rate}).")

        # 4. Enforce that recommended actions are labeled as RECOMMENDATION
        for rec in report.recommended_actions:
            rec_type = rec.claim_type.value if hasattr(rec.claim_type, "value") else str(rec.claim_type)
            if rec_type != "RECOMMENDATION":
                errors.append(f"Recommended action '{rec.statement[:30]}' must have claim_type 'RECOMMENDATION', not '{rec_type}'.")

        # Collect references
        collected_refs = set()
        for claim in all_claims:
            collected_refs.update(claim.evidence_ids)
            
        report.evidence_references = list(collected_refs)
        
        passed = len(errors) == 0 and grounding_passed
        
        final_report = {
            "passed": passed,
            "errors": errors,
            "warnings": warnings,
            "grounding": grounding_report,
            "thresholds_used": self.thresholds
        }
        
        return passed, final_report
