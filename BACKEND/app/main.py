from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.database import close_mongo_connection, connect_to_mongo
from app.routes.billing_routes import router as billing_router
from app.routes.purchase_routes import router as purchase_router
from app.routes.admin_routes import router as admin_router
from app.middlewares.error_handler import global_exception_handler
from app.utils.logger import logger

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await connect_to_mongo()
    logger.info("Application startup complete.")

@app.on_event("shutdown")
async def shutdown():
    await close_mongo_connection()              
    logger.info("Application shutdown complete.")

    
app.add_exception_handler(Exception, global_exception_handler)

app.include_router(billing_router, prefix="/api/v1")
app.include_router(purchase_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
