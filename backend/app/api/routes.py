from fastapi import APIRouter
from app.models.schema import ScenarioInput
from app.reasoning.plain_llm import generate_reasoning
from app.reasoning.rule_engine import rule_based_analysis
from app.db.database import SessionLocal
from app.db.models import DecisionLog
from app.utils.sanitize import clean_floats
import math
import json
import time

router = APIRouter()

@router.post("/run")
def run_scenario(scenario: ScenarioInput):

    # Generate reasoning result
    result = generate_reasoning(scenario)

    # Build full response (include scenario)
    full_response = {
        "scenario": scenario.dict(),
        **result
    }

    # Clean ALL floats before anything else
    safe_response = clean_floats(full_response)

    # Save cleaned version to DB
    save_to_db(safe_response)

    # Return cleaned version to FastAPI
    return safe_response

@router.post("/compare")
def compare_models(scenario: ScenarioInput):

    # ── 1. Plain LLM only ──────────────────────────────────────────
    llm_start = time.time()
    llm_result = generate_reasoning(scenario)
    llm_time = round((time.time() - llm_start) * 1000, 2)

    # ── 2. Rule engine only ────────────────────────────────────────
    rule_start = time.time()
    rule_result = rule_based_analysis(scenario)
    rule_time = round((time.time() - rule_start) * 1000, 2)

    # ── 3. Hybrid (already computed inside llm_result) ────────────
    hybrid_decision = llm_result.get("decisions", {}).get("final", "UNKNOWN")
    hybrid_override = llm_result.get("decisions", {}).get("override", False)
    hybrid_risk     = llm_result.get("metrics", {}).get("risk_score")
    hybrid_ttc      = llm_result.get("metrics", {}).get("min_ttc")
    hybrid_latency  = llm_result.get("latency", {}).get("total_ms", 0.0)

    response = {
        "scenario": scenario.dict(),
        "comparison": {
            "plain_llm": {
                "decision":   llm_result.get("decisions", {}).get("llm", "UNKNOWN"),
                "confidence": llm_result.get("confidence"),
                "steps":      llm_result.get("steps", []),
                "latency_ms": llm_time
            },
            "rule_only": {
                "decision":          rule_result.get("rule_decision", "UNKNOWN"),
                "risk_score":        rule_result.get("risk_score"),
                "min_ttc":           rule_result.get("min_ttc"),
                "stopping_distance": rule_result.get("stopping_distance"),
                "safety_level":      rule_result.get("safety_level"),
                "latency_ms":        rule_time
            },
            "hybrid": {
                "decision":          hybrid_decision,
                "override_applied":  hybrid_override,
                "llm_said":          llm_result.get("decisions", {}).get("llm", "UNKNOWN"),
                "rule_said":         llm_result.get("decisions", {}).get("rule", "UNKNOWN"),
                "risk_score":        hybrid_risk,
                "min_ttc":           hybrid_ttc,
                "confidence":        llm_result.get("confidence"),
                "disagreement_level": llm_result.get("disagreement_level", "NONE"),
                "latency_ms":        hybrid_latency
            }
        }
    }

    return clean_floats(response)

@router.get("/check-db")
def check_db():
    db = SessionLocal()
    try:
        count = db.query(DecisionLog).count()
        return {"total_rows": count}
    finally:
        db.close()


def save_to_db(data):
    db = SessionLocal()
    try:
        log = DecisionLog(
            scenario=data.get("scenario"),
            llm_decision=data.get("decisions", {}).get("llm"),
            rule_decision=data.get("decisions", {}).get("rule"),
            final_decision=data.get("decisions", {}).get("final"),
            override=data.get("decisions", {}).get("override"),
            risk_score=data.get("metrics", {}).get("risk_score"),
            min_ttc=data.get("metrics", {}).get("min_ttc"),
            stopping_distance=data.get("metrics", {}).get("stopping_distance"),
            confidence=data.get("confidence", 0.0),
            total_latency_ms=data.get("latency", {}).get("total_ms", 0.0),
            disagreement_level=data.get("disagreement_level", "NONE"),
            weather=data.get("scenario", {}).get("weather", "unknown")
        )

        db.add(log)
        db.commit()
    finally:
        db.close()


