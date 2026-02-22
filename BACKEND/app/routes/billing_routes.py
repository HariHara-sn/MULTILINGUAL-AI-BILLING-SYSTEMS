from fastapi import APIRouter
from pydantic import BaseModel
from app.controllers.billing_controller import process_voice_text

router = APIRouter()

class BillingRequest(BaseModel):
    text: str

@router.post("/generate-bill")
async def generate_bill_route(request: BillingRequest):
    return await process_voice_text(request.text)