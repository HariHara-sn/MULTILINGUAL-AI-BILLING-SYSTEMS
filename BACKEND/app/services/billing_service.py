from app.config import database as db_config
from app.utils.unit_converter import normalize_unit
from app.utils.logger import logger

async def generate_bill(parsed_items):
    products_collection = db_config.db["products"]
    
    bill = []
    total = 0
    
    for entry in parsed_items:
        item_name = entry["item"].lower().strip()
        product = await products_collection.find_one({"name": item_name})

        if not product:
            logger.warning(f"Product not found in database: {item_name}")
            continue

        price = product["unit_price"] * entry["qty"]
        total += price


        bill.append({
            "item": entry["item"],
            "qty": entry["qty"],
            "unit": normalize_unit(entry["unit"]),
            "price": price
        })

    return {"items": bill, "total": total}