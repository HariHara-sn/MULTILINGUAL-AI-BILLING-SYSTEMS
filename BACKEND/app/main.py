from fastapi import FastAPI
from app.routes.billing_routes import router as billing_router
from app.routes.purchase_routes import router as purchase_router
from app.middlewares.error_handler import global_exception_handler

app = FastAPI()
app.add_exception_handler(Exception, global_exception_handler)

app.include_router(billing_router, prefix="/api/v1")
app.include_router(purchase_router, prefix="/api/v1")
