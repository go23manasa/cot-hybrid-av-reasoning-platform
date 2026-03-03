from fastapi import APIRouter
from app.models.schema import ScenarioInput
from app.reasoning.plain_llm import generate_reasoning
from app.db.database import SessionLocal
from app.db.models import DecisionLog
from app.utils.sanitize import clean_floats
import math
import json

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
            total_latency_ms=data.get("latency", {}).get("total_ms", 0.0)
        )

        db.add(log)
        db.commit()
    finally:
        db.close()


