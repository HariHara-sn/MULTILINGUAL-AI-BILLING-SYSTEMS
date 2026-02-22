import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGO_URI = os.getenv("MONGO_URI")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

settings = Settings()
print("----- MONGO_URI:", settings.MONGO_URI)