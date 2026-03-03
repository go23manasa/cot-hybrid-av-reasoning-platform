import os
import time
from groq import Groq
from app.rag.retriever import retrieve_rules
from app.reasoning.rule_engine import rule_based_analysis

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_rag_reasoning(scenario):
    """LLM reasoning grounded with retrieved traffic rules."""

    rule_start = time.time()
    rule_result = rule_based_analysis(scenario)
    rule_ms = round((time.time() - rule_start) * 1000, 2)

    # Build scenario description for retrieval
    objects_desc = ", ".join(
        [f"{obj.type} at {obj.distance}m" for obj in scenario.objects]
    )
    scenario_text = (
        f"{objects_desc}, speed {scenario.ego_speed} km/h, weather {scenario.weather}"
    )

    # Retrieve top 3 relevant rules
    retrieved_rules = retrieve_rules(scenario_text, top_k=3)
    rules_text = "\n".join([f"- {r}" for r in retrieved_rules])

    prompt = f"""You are an autonomous vehicle decision system.

RETRIEVED TRAFFIC RULES (use these to ground your reasoning):
{rules_text}

SCENARIO:
- Objects detected: {objects_desc}
- Ego vehicle speed: {scenario.ego_speed} km/h
- Weather: {scenario.weather}
- Rule engine computed: risk_score={rule_result['risk_score']}, min_ttc={rule_result['min_ttc']}s, stopping_distance={rule_result['stopping_distance']}m

Based on the traffic rules above and the scenario data, reason step by step and make a driving decision.

Respond in this exact format:
STEP 1: [your first reasoning step]
STEP 2: [your second reasoning step]  
STEP 3: [your third reasoning step]
DECISION: [STOP or SLOW DOWN or CONTINUE]
CONFIDENCE: [0.0 to 1.0]"""

    llm_start = time.time()
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400,
            temperature=0.2
        )
        llm_ms = round((time.time() - llm_start) * 1000, 2)
        raw = response.choices[0].message.content.strip()

    except Exception as e:
        print("RAG LLM ERROR:", str(e))
        return {
            "steps": ["RAG model execution failed"],
            "retrieved_rules": retrieved_rules,
            "decisions": {
                "llm": "ERROR", "rule": "UNKNOWN",
                "final": "ERROR", "override": False
            },
            "metrics": {
                "risk_score": None, "min_ttc": None,
                "stopping_distance": None, "safety_level": "UNKNOWN"
            },
            "confidence": 0.0,
            "confidence_warning": False,
            "disagreement_level": "NONE",
            "latency": {"llm_ms": 0.0, "rule_ms": rule_ms, "total_ms": rule_ms}
        }

    # Parse steps
    steps = []
    for line in raw.split("\n"):
        line = line.strip()
        if line.startswith("STEP"):
            steps.append(line)

    # Parse decision
    llm_decision = "CONTINUE"
    for line in raw.split("\n"):
        if line.strip().startswith("DECISION:"):
            val = line.split(":", 1)[1].strip().upper()
            if "STOP" in val:
                llm_decision = "STOP"
            elif "SLOW" in val:
                llm_decision = "SLOW DOWN"
            else:
                llm_decision = "CONTINUE"

    # Parse confidence
    confidence = 0.85
    for line in raw.split("\n"):
        if line.strip().startswith("CONFIDENCE:"):
            try:
                confidence = float(line.split(":", 1)[1].strip())
            except:
                confidence = 0.85

    # Hybrid override logic (same as plain_llm)
    rule_decision = rule_result["rule_decision"]
    safety_level = rule_result["safety_level"]

    override = False
    final_decision = llm_decision

    if safety_level == "HIGH" and llm_decision != "STOP":
        final_decision = "STOP"
        override = True
    elif safety_level == "MEDIUM" and llm_decision == "CONTINUE":
        final_decision = "SLOW DOWN"
        override = True

    # Disagreement level
    if llm_decision == rule_decision:
        disagreement_level = "NONE"
    elif (llm_decision == "STOP" and rule_decision == "CONTINUE") or \
         (llm_decision == "CONTINUE" and rule_decision == "STOP"):
        disagreement_level = "CRITICAL"
    elif llm_decision == "SLOW DOWN" and rule_decision == "STOP":
        disagreement_level = "CRITICAL"
    else:
        disagreement_level = "MODERATE"

    confidence_warning = confidence < 0.7
    total_ms = round(llm_ms + rule_ms, 2)

    return {
        "steps": steps if steps else [raw],
        "retrieved_rules": retrieved_rules,        # ← extra field vs plain_llm
        "decisions": {
            "llm": llm_decision,
            "rule": rule_decision,
            "final": final_decision,
            "override": override
        },
        "metrics": {
            "risk_score": rule_result["risk_score"],
            "min_ttc": rule_result["min_ttc"],
            "stopping_distance": rule_result["stopping_distance"],
            "safety_level": safety_level
        },
        "confidence": confidence,
        "confidence_warning": confidence_warning,
        "disagreement_level": disagreement_level,
        "latency": {
            "llm_ms": llm_ms,
            "rule_ms": rule_ms,
            "total_ms": total_ms
        }
    }