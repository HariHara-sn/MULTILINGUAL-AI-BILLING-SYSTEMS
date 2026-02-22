UNIT_MAP = {
    "கிலோ": "kg",
    "kg": "kg",
    "gram": "g",
    "கிராம்": "g"
}

def normalize_unit(unit: str):
    return UNIT_MAP.get(unit.lower(), unit)