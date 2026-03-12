UNIT_MAP = {
    "கிலோ": "kg",
    "kg": "kg",
    "gram": "g",
    "கிராம்": "g",
    "க": "kg",
    "லிட்டர்": "litre",
    "litre": "litre",
    "piece": "piece",
    "துண்டு": "piece",
    "பார்சல்": "pack",
    "pack": "pack",
    "dozen": "dozen",
    "அரை": "0.5",  # Half
    "கால்": "0.25", # Quarter
    "முக்கால்": "0.75" # Three-quarters
}


def normalize_unit(unit: str):
    return UNIT_MAP.get(unit.lower(), unit)