from fastapi import APIRouter
from app.models.product_model import SavePurchase
from app.services.save_purchase_service import save_purchase, get_purchase_history

router = APIRouter()

@router.post("/confirm-purchase")
async def confirm_purchase_route(request: SavePurchase):

    await save_purchase(request)
    return {"message": "Purchase saved successfully"}

@router.get("/get-purchase/{phone_number}")
async def get_history_route(phone_number: str):
    return await get_purchase_history(phone_number)


    