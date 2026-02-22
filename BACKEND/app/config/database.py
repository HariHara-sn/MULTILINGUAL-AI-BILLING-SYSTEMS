from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings

client = AsyncIOMotorClient(settings.MONGO_URI)

db = client["MULTILINGUAL-AI-BILLING-SYSTEMS-DB"]
products_collection = db["products"]