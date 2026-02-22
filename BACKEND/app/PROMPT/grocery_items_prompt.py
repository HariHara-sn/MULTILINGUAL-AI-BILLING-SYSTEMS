GROCERY_ITEMS_PROMPT = """
    Extract grocery items with quantity and unit from the following text.
    Translate the item name to Tamil as it appears in a typical Tamil grocery database (e.g., "தக்காளி", "வெங்காயம்").
    
    For each item, provide:
    1. "item": The name of the item in Tamil.
    2. "qty": The numerical quantity.
    3. "unit": The unit (e.g., "kg", "gram", "piece").

    Return the result as a JSON array of objects only.
    Input: {text}
    """
