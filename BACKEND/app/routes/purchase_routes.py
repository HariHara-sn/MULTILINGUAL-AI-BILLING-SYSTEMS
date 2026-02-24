from fastapi import APIRouter
from app.controllers.billing_controller import get_purchase_history
from app.models.product_model import SavePurchase
from app.services.save_purchase_service import save_purchase
from app.utils.logger import logger

router = APIRouter()

@router.post("/confirm-purchase")
async def save_purchase_route(request: SavePurchase):
    logger.info(f"POST /save-purchase request for phone: {request.phone}")
    await save_purchase(request)
    return {"message": "Purchase saved successfully"}

@router.get("/get-purchase/{phone_number}")
async def get_history_route(phone_number: str):
    logger.info(f"GET /get-purchase request for phone: {phone_number}")
    return await get_purchase_history(phone_number)


    