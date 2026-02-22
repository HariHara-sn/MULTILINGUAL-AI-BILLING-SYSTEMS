from app.services.gemini_service import parse_items
from app.services.billing_service import generate_bill

async def process_voice_text(text: str):
    parsed = await parse_items(text)
    bill = await generate_bill(parsed)
    print("final bill: ", bill)
    return bill
