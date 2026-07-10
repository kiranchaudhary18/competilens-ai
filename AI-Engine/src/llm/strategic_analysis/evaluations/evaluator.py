import json
import time
from typing import List, Dict, Any
from llm.shared.schemas.evidence import EvidencePack
from ..src.schemas.strategic_schema import StrategicAnalysisResult
from ..src.validation.strategic_validator import StrategicValidator


class StrategicEvaluator:
    """
    Offline validation/evaluation suite for Strategic Analysis reports.
    Measures grounding rate, evidence coverage, schema conformance, and latency.
    """

    def __init__(self):
        self.validator = StrategicValidator()

    def evaluate_dataset(
        self,
        test_dataset: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Evaluate a series of test cases.
        Each test case is expected to contain:
            - "evidence_pack": EvidencePack instance or dict
            - "generated_analysis": StrategicAnalysisResult instance or dict
            - "ground_truth": (optional) expected SWOT statements
        """
        results = []
        total_grounding_rate = 0.0
        total_coverage_rate = 0.0
        schema_valid_count = 0
        total_eval_time = 0.0
        
        for idx, case in enumerate(test_dataset):
            start = time.time()
            
            raw_pack = case.get("evidence_pack")
            raw_analysis = case.get("generated_analysis")
            
            # Reconstruct model instances if needed
            if isinstance(raw_pack, dict):
                evidence_pack = EvidencePack.model_validate(raw_pack)
            else:
                evidence_pack = raw_pack
                
            if isinstance(raw_analysis, dict):
                try:
                    analysis = StrategicAnalysisResult.model_validate(raw_analysis)
                    schema_valid = True
                except Exception:
                    schema_valid = False
                    analysis = None
            else:
                analysis = raw_analysis
                schema_valid = analysis is not None

            eval_time = time.time() - start
            total_eval_time += eval_time

            if not schema_valid or not analysis:
                results.append({
                    "case_index": idx,
                    "schema_valid": False,
                    "grounding_rate": 0.0,
                    "evidence_coverage": 0.0,
                    "passed": False,
                    "errors": ["Failed schema validation parsing."]
                })
                continue

            schema_valid_count += 1
            passed, report = self.validator.validate_analysis(analysis, evidence_pack)
            
            g_rate = report["grounding"]["grounding_rate"]
            cov_rate = report["grounding"]["evidence_coverage_rate"]
            
            total_grounding_rate += g_rate
            total_coverage_rate += cov_rate
            
            results.append({
                "case_index": idx,
                "schema_valid": True,
                "grounding_rate": g_rate,
                "evidence_coverage": cov_rate,
                "passed": passed,
                "errors": report["errors"],
                "warnings": report["warnings"]
            })

        num_cases = len(test_dataset)
        avg_grounding = total_grounding_rate / num_cases if num_cases > 0 else 1.0
        avg_coverage = total_coverage_rate / num_cases if num_cases > 0 else 1.0
        schema_valid_rate = schema_valid_count / num_cases if num_cases > 0 else 1.0

        return {
            "cases_evaluated": num_cases,
            "overall_metrics": {
                "schema_validity_rate": round(schema_valid_rate, 3),
                "average_grounding_rate": round(avg_grounding, 3),
                "average_evidence_coverage": round(avg_coverage, 3),
                "total_evaluation_time_seconds": round(total_eval_time, 3)
            },
            "results": results
        }
