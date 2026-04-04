import os
import time
from dotenv import load_dotenv
from openai import OpenAI
from app.reasoning.rule_engine import rule_based_analysis
from app.utils.logger import log_decision

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def generate_reasoning(scenario):
    start_time = time.time()

    prompt = f"""
You are an autonomous vehicle reasoning system.

You MUST respond in valid JSON format only.
Do NOT include explanations outside JSON.

Required JSON format:

{{
  "steps": ["step 1", "step 2", "step 3"],
  "final_decision": "STOP or SLOW DOWN or CONTINUE",
  "confidence": number between 0 and 1
}}

Scenario:
Objects: {scenario.objects}
Speed: {scenario.ego_speed} km/h
Weather: {scenario.weather}
"""

    try:
        # -------------------------
        # LLM TIMING START
        # -------------------------
        llm_start = time.time()

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are an autonomous driving AI."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )

        llm_latency = round((time.time() - llm_start) * 1000, 2)

        total_latency = round((time.time() - start_time) * 1000, 2)

        import json
        raw_output = response.choices[0].message.content.strip()

        try:
            parsed = json.loads(raw_output)
        except:
            print("JSON PARSE ERROR:", raw_output)
            return {
                "steps": ["Model returned invalid JSON"],
                "decision": "UNKNOWN",
                "confidence": 0.0,
                "latency_ms": total_latency
            }

        # -------------------------
        # RULE ENGINE TIMING
        # -------------------------
        rule_start = time.time()

        analysis = rule_based_analysis(scenario)

        rule_latency = round((time.time() - rule_start) * 1000, 2)

        # -------------------------
        # DECISION LOGIC
        # -------------------------
        llm_decision = parsed.get("final_decision", "UNKNOWN")
        rule_decision = analysis["rule_decision"]

        override = False

        if rule_decision == "STOP" and llm_decision != "STOP":
            final_decision = "STOP"
            override = True
        else:
            final_decision = llm_decision

        # -------------------------
        # CONFIDENCE MISMATCH (Update 8)
        # -------------------------
        confidence = parsed.get("confidence", 0.0)

        confidence_warning = False
        if override and confidence > 0.8:
            confidence_warning = True

        # -------------------------
        # DISAGREEMENT SEVERITY (Update 9)
        # -------------------------
        if override:
            if analysis["risk_score"] > 2:
                disagreement_level = "CRITICAL"
            else:
                disagreement_level = "MODERATE"
        else:
            disagreement_level = "NONE"

        # -------------------------
        # LOGGING (Enhanced)
        # -------------------------
        log_decision({
            "timestamp": time.time(),

            "scenario": {
                "objects": [
                    {"type": obj.type, "distance": obj.distance}
                    for obj in scenario.objects
                ],
                "ego_speed": scenario.ego_speed,
                "weather": scenario.weather
            },

            "decisions": {
                "llm": llm_decision,
                "rule": rule_decision,
                "final": final_decision,
                "override": override
            },

            "metrics": {
                "risk_score": analysis["risk_score"],
                "min_ttc": analysis["min_ttc"],
                "stopping_distance": analysis["stopping_distance"],
                "safety_level": analysis["safety_level"]
            },

            "confidence": confidence,
            "confidence_warning": confidence_warning,
            "disagreement_level": disagreement_level,
            "latency": {
                "llm_ms": llm_latency,
                "rule_ms": rule_latency,
                "total_ms": total_latency
            }
        })

        # -------------------------
        # FINAL API RESPONSE
        # -------------------------
        return {
            "steps": parsed.get("steps", []),

            "decisions": {
                "llm": llm_decision,
                "rule": rule_decision,
                "final": final_decision,
                "override": override
            },

            "metrics": {
                "risk_score": analysis["risk_score"],
                "min_ttc": analysis["min_ttc"],
                "stopping_distance": analysis["stopping_distance"],
                "safety_level": analysis["safety_level"]
            },

            "confidence": confidence,
            "confidence_warning": confidence_warning,
            "disagreement_level": disagreement_level,

            "latency": {
                "llm_ms": llm_latency,
                "rule_ms": rule_latency,
                "total_ms": total_latency
            }
        }

    except Exception as e:
        print("GROQ ERROR:", str(e))
        return {
            "steps": ["Model execution failed"],
            "decision": "ERROR",
            "confidence": 0.0,
            "latency_ms": 0
        }