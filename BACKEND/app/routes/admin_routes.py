from fastapi import APIRouter
from app.controllers.admin_controller import get_products
from app.utils.logger import logger

router = APIRouter()

@router.get("/get-all-items")
async def get_all_items_route():
    logger.info("GET /get-all-items request received")
    return await get_products()

#admin can update the item name, price
@router.patch("/update-item")
async def update_items_route():
    logger.info("PATCH /update-item request received")
    return await update_products()
#admin can add the item
@router.post("/add-item")
async def add_items_route():
    logger.info("POST /add-item request received")
    return await add_products()
