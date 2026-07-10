import logging
from typing import List, Set, Tuple, Dict, Any
from ..schemas.evidence import EvidencePack
from ..schemas.citation import GroundedClaim

logger = logging.getLogger("competilens.ai_engine.llm.validation.grounding")


class GroundingValidator:
    """
    Validates output generated claims against input evidence packs to guarantee grounding.
    Flags hallucinated citations (fake IDs) and un-cited facts/inferences.
    """

    @staticmethod
    def validate_grounding(
        claims: List[GroundedClaim],
        evidence_pack: EvidencePack
    ) -> Tuple[bool, Dict[str, Any]]:
        """
        Validate list of claims against a verified evidence pack.
        
        Returns:
            Tuple of (is_passed, validation_report_dictionary)
        """
        valid_ids: Set[str] = {item.evidence_id for item in evidence_pack.items}
        
        hallucinated_citations: List[Dict[str, Any]] = []
        unsupported_claims: List[Dict[str, Any]] = []
        fully_grounded_count = 0
        
        for idx, claim in enumerate(claims):
            cited_ids = claim.evidence_ids
            claim_type_str = claim.claim_type.value if hasattr(claim.claim_type, "value") else str(claim.claim_type)
            
            # Rule 1: FACT and INFERENCE require at least one citation
            if claim_type_str in ["FACT", "INFERENCE"] and not cited_ids:
                unsupported_claims.append({
                    "index": idx,
                    "statement": claim.statement,
                    "claim_type": claim_type_str,
                    "reason": f"Claims of type {claim_type_str} must cite at least one evidence ID."
                })
                continue
                
            # Rule 2: All cited IDs must actually exist in the evidence pack
            invalid_citations = [cid for cid in cited_ids if cid not in valid_ids]
            if invalid_citations:
                hallucinated_citations.append({
                    "index": idx,
                    "statement": claim.statement,
                    "invalid_evidence_ids": invalid_citations,
                    "reason": f"Cited evidence IDs {invalid_citations} do not exist in the evidence pack."
                })
                continue
                
            # Check confidence ranges
            if claim.confidence < 0.0 or claim.confidence > 1.0:
                unsupported_claims.append({
                    "index": idx,
                    "statement": claim.statement,
                    "reason": "Confidence score must be between 0.0 and 1.0."
                })
                continue

            fully_grounded_count += 1

        total_claims = len(claims)
        grounding_rate = (fully_grounded_count / total_claims) if total_claims > 0 else 1.0
        
        passed = len(hallucinated_citations) == 0 and len(unsupported_claims) == 0
        
        report = {
            "passed": passed,
            "total_claims_evaluated": total_claims,
            "fully_grounded_claims": fully_grounded_count,
            "grounding_rate": round(grounding_rate, 3),
            "hallucinated_citations": hallucinated_citations,
            "unsupported_claims": unsupported_claims,
            "evidence_coverage_rate": GroundingValidator.calculate_evidence_coverage(claims, valid_ids)
        }
        
        if not passed:
            logger.warning(f"Grounding validation failed: {report}")
        else:
            logger.info(f"Grounding validation passed. Grounding rate: {grounding_rate * 100}%")

        return passed, report

    @staticmethod
    def calculate_evidence_coverage(claims: List[GroundedClaim], valid_ids: Set[str]) -> float:
        """
        Calculates the percentage of available evidence that was cited in the analysis.
        Helps measure if the LLM is ignoring relevant inputs.
        """
        if not valid_ids:
            return 1.0
            
        cited_ids: Set[str] = set()
        for claim in claims:
            for cid in claim.evidence_ids:
                if cid in valid_ids:
                    cited_ids.add(cid)
                    
        return round(len(cited_ids) / len(valid_ids), 3)
