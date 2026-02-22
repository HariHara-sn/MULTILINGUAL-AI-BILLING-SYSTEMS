from fastapi import FastAPI
from app.routes.billing_routes import router

app = FastAPI()

app.include_router(router, prefix="/api/v1")