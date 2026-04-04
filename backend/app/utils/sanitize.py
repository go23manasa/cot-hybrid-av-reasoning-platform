import math

def clean_floats(obj):
    if isinstance(obj, float):
        if math.isinf(obj) or math.isnan(obj):
            return None
        return obj

    if isinstance(obj, dict):
        return {k: clean_floats(v) for k, v in obj.items()}

    if isinstance(obj, list):
        return [clean_floats(v) for v in obj]

    return obj