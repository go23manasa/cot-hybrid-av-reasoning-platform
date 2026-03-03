def compute_stopping_distance(speed_kmh, weather="clear"):
    speed_ms = speed_kmh / 3.6
    deceleration = 9.8 * 0.7  # friction coefficient

    if weather in ["rain", "wet"]:
        deceleration *= 0.6
    elif weather in ["snow", "ice"]:
        deceleration *= 0.3
    elif weather == "fog":
        deceleration *= 0.85

    if speed_ms == 0:
        return 0.0

    return round((speed_ms ** 2) / (2 * deceleration), 2)


def compute_ttc(distance, speed_kmh):
    speed_ms = speed_kmh / 3.6
    if speed_ms <= 0:
        return None
    return round(distance / speed_ms, 2)


def rule_based_analysis(scenario):
    ego_speed = scenario.ego_speed
    stopping_distance = compute_stopping_distance(ego_speed, scenario.weather)

    max_risk = 0
    ttc_values = []
    rule_decision = "CONTINUE"

    for obj in scenario.objects:
        distance = obj.distance

        # SAFE TTC
        ttc = compute_ttc(distance, ego_speed)
        if ttc is not None:
            ttc_values.append(ttc)

        # SAFE RISK (NO infinity)
        if distance > 0:
            risk = stopping_distance / distance
            if risk > max_risk:
                max_risk = risk
        else:
            risk = None  # NEVER use infinity

        # Pedestrian rule
        if obj.type == "pedestrian":
            if (risk is not None and risk > 1) or (ttc is not None and ttc < 1.5):
                rule_decision = "STOP"

    min_ttc = min(ttc_values) if ttc_values else None

    if max_risk < 0.5:
        safety_level = "LOW"
    elif max_risk < 1:
        safety_level = "MEDIUM"
    else:
        safety_level = "HIGH"

    return {
        "rule_decision": rule_decision,
        "stopping_distance": round(stopping_distance, 2),
        "min_ttc": round(min_ttc, 2) if min_ttc is not None else None,
        "risk_score": round(max_risk, 2),
        "safety_level": safety_level
    }