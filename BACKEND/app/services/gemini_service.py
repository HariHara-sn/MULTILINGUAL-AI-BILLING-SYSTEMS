import json
import re

import google.generativeai as genai
from app.config.settings import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash-lite")

async def parse_items(text: str):
    prompt = f"""
    Extract grocery items with quantity and unit.
    Return JSON array only.
    Input: {text}
    Example Output:
    [
      {{"item": "தக்காளி", "qty": 1, "unit": "kg"}}
    ]
    """
    
    response = model.generate_content(prompt)
    raw_text = response.text

    # Remove markdown if present
    cleaned = re.sub(r"```json|```", "", raw_text).strip()
    print("stage - 1: Gemini output : ", cleaned)

    return json.loads(cleaned)
