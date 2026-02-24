from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings
from app.utils.logger import logger

client: AsyncIOMotorClient = None
db = None

async def connect_to_mongo():
    global client, db
    try:
        logger.debug("Attempting to connect to MongoDB Atlas...")
        client = AsyncIOMotorClient(
            settings.MONGO_URI,
            serverSelectionTimeoutMS=10000,  # Increased timeout to 10s
            connectTimeoutMS=10000
        )

        await client.admin.command("ping")
        
        db = client["MULTILINGUAL-AI-BILLING-SYSTEMS-DB"]

        logger.info(f"Successfully connected to MongoDB Atlas database")

    except Exception as e:
        logger.error(f"MongoDB connection failed: {e}")
        raise e

async def close_mongo_connection():
    global client
    if client:
        client.close()
        logger.critical("MongoDB connection closed")