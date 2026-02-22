from fastapi import APIRouter
from app.controllers.billing_controller import process_voice_text
from app.models.product_model import BillingRequest

router = APIRouter()


@router.post("/generate-bill")
async def generate_bill_route(request: BillingRequest):
    return await process_voice_text(request.text)
