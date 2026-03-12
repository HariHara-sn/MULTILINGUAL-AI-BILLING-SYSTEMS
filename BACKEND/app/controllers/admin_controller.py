from app.models.product_model import AddProduct
from app.config import database as db_config
from app.utils.logger import logger
from bson import ObjectId

def get_collection():
    return db_config.db["products"]

async def get_products():
    cursor = get_collection().find({})
    products = await cursor.to_list(length=100)

    for p in products:
        p["_id"] = str(p["_id"])
    return products

async def update_products(data):
    # data is expected to have product_name, price, unit
    product_name = data.get("product_name")
    if not product_name:
        return {"error": "product_name is required"}
    
    update_data = {}
    if "price" in data: update_data["price"] = data["price"]
    if "unit" in data: update_data["unit"] = data["unit"]
    
    result = await get_collection().find_one_and_update(
        {"product_name": product_name},

        {"$set": update_data},
        return_document=True
    )
    if result:
        result["_id"] = str(result["_id"])
        return result
    return {"error": "Product not found"}

async def add_products(add_product_data: AddProduct):
    new_doc = {
        "product_name": add_product_data.product_name,
        "price": add_product_data.price,
        "unit": add_product_data.unit
    }
    result = await get_collection().insert_one(new_doc)

    return {"message": "Product added successfully", "id": str(result.inserted_id)}