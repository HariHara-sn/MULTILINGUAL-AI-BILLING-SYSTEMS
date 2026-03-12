from fastapi import APIRouter, Request
from app.models.product_model import AddProduct
from app.controllers.admin_controller import add_products, get_products, update_products
from app.utils.logger import logger

router = APIRouter()

@router.get("/get-all-items")
async def get_all_items_route():
    logger.info("GET /get-all-items request received")
    return await get_products()

@router.patch("/update-item")
async def update_items_route(request: Request):
    data = await request.json()
    logger.info(f"PATCH /update-item request received for {data.get('product_name')}")
    return await update_products(data)

@router.post("/add-item")
async def add_items_route(add_product: AddProduct):
    logger.info(f"POST /add-item request received for {add_product.product_name}")
    return await add_products(add_product)
