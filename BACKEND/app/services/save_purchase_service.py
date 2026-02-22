# save user data in db
from datetime import datetime
from app.config.database import db
from app.models.product_model import SavePurchase

async def save_purchase(purchase: SavePurchase):
    document = {
        "customer_name": purchase.name,
        "phone": purchase.phone,
        "items": [item.dict() for item in purchase.items],
        "total": purchase.total,
        "created_at": datetime.utcnow()
    }

    await db.user_purchases.insert_one(document)

async def get_purchase_history(phone: str):
    cursor = db.user_purchases.find({"phone": phone}).sort("created_at", -1)
    purchases = await cursor.to_list(length=100)
    for purchase in purchases:
        purchase["_id"] = str(purchase["_id"])
    return purchases
