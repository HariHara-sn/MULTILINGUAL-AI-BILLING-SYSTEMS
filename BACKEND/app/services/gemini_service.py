import json
import re

import google.generativeai as genai
from app.config.settings import settings
from app.PROMPTS.grocery_items_prompt import GROCERY_ITEMS_PROMPT

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash-lite")

async def parse_items(text: str):
    prompt = GROCERY_ITEMS_PROMPT.format(text=text)
    
    response = model.generate_content(prompt)
    raw_text = response.text
    print("raw_text: ", raw_text)
    cleaned = re.sub(r"```json|```", "", raw_text).strip()

    return json.loads(cleaned)
