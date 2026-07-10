import time
from typing import List, Dict, Any
from llm.shared.schemas.evidence import EvidencePack
from ..src.schemas.report_schema import ExecutiveReportResult
from ..src.validation.report_validator import ExecutiveReportValidator


class ExecutiveReportEvaluator:
    """
    Offline evaluation suite for Executive Reports.
    """

    def __init__(self):
        self.validator = ExecutiveReportValidator()

    def evaluate_dataset(
        self,
        test_dataset: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        results = []
        total_grounding_rate = 0.0
        schema_valid_count = 0
        total_eval_time = 0.0
        
        for idx, case in enumerate(test_dataset):
            start = time.time()
            
            raw_pack = case.get("evidence_pack")
            raw_report = case.get("generated_report")
            
            if isinstance(raw_pack, dict):
                evidence_pack = EvidencePack.model_validate(raw_pack)
            else:
                evidence_pack = raw_pack
                
            if isinstance(raw_report, dict):
                try:
                    report = ExecutiveReportResult.model_validate(raw_report)
                    schema_valid = True
                except Exception:
                    schema_valid = False
                    report = None
            else:
                report = raw_report
                schema_valid = report is not None

            eval_time = time.time() - start
            total_eval_time += eval_time

            if not schema_valid or not report:
                results.append({
                    "case_index": idx,
                    "schema_valid": False,
                    "grounding_rate": 0.0,
                    "passed": False,
                    "errors": ["Failed report schema validation parsing."]
                })
                continue

            schema_valid_count += 1
            passed, val_report = self.validator.validate_report(report, evidence_pack)
            
            g_rate = val_report["grounding"]["grounding_rate"]
            total_grounding_rate += g_rate
            
            results.append({
                "case_index": idx,
                "schema_valid": True,
                "grounding_rate": g_rate,
                "passed": passed,
                "errors": val_report["errors"],
                "warnings": val_report["warnings"]
            })

        num_cases = len(test_dataset)
        avg_grounding = total_grounding_rate / num_cases if num_cases > 0 else 1.0
        schema_valid_rate = schema_valid_count / num_cases if num_cases > 0 else 1.0

        return {
            "cases_evaluated": num_cases,
            "overall_metrics": {
                "schema_validity_rate": round(schema_valid_rate, 3),
                "average_grounding_rate": round(avg_grounding, 3),
                "total_evaluation_time_seconds": round(total_eval_time, 3)
            },
            "results": results
        }
