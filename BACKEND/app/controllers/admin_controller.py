from app.services.gemini_service import parse_items
from app.services.billing_service import generate_bill
from app.config import database as db_config
from app.utils.logger import logger

async def get_products():
    collection = db_config.db["products"]
    cursor = collection.find({})
    products = await cursor.to_list(length=100)
    for p in products:
        p["_id"] = str(p["_id"])
    return products
#Pending neeed to implement
async def update_products():
    pass
async def add_products():
    pass