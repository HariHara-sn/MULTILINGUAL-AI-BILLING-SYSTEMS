# save user data in db
from datetime import datetime
from app.config.database import db

async def save_purchase(name, phone, bill_data):
    document = {
        "customer_name": name,
        "phone": phone,
        "items": bill_data["items"],
        "total": bill_data["total"],
        "created_at": datetime.utcnow()
    }

    await db.user_purchases.insert_one(document)