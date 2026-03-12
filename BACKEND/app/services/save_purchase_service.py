# save user data in db
from datetime import datetime
from app.config import database as db_config
from app.models.product_model import SavePurchase
from app.utils.logger import logger

async def save_purchase(purchase: SavePurchase):
    # Fix: Lazy access to avoid NoneType at startup
    collection = db_config.db.user_purchases
    document = {
        "customer_name": purchase.name,
        "phone": purchase.phone,
        "items": [item.dict() for item in purchase.items],
        "total": purchase.total,
        "created_at": datetime.utcnow()
    }

    result = await collection.insert_one(document)

    logger.info(f"Successfully saved purchase for {purchase.phone}. Doc ID: {result.inserted_id}")