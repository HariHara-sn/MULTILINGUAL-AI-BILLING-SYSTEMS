from app.services.gemini_service import parse_items
from app.services.billing_service import generate_bill
from app.config import database as db_config
from app.utils.logger import logger

async def process_voice_text(text: str):
    parsed = await parse_items(text)
    bill = await generate_bill(parsed)
    return bill

async def get_purchase_history(phone: str):
    cursor = db_config.db.user_purchases.find({"phone": phone}).sort("created_at", -1)
    purchases = await cursor.to_list(length=100)
    for purchase in purchases:
        purchase["_id"] = str(purchase["_id"])
    return purchases