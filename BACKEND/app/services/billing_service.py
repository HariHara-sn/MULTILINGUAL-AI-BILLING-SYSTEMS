from app.config.database import products_collection, db
from app.utils.unit_converter import normalize_unit

async def generate_bill(parsed_items):

    bill = []
    total = 0
    
    for entry in parsed_items:
        item_name = entry["item"].lower().strip()
        product = await products_collection.find_one({"name": item_name})


        if not product:
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