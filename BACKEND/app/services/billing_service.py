from app.config.database import products_collection, db
from app.utils.unit_converter import normalize_unit

async def generate_bill(parsed_items):

    bill = []
    total = 0
    
    for entry in parsed_items:
        print("processing entry: ", entry)
        print("haiiririrh----", db.products.find())
        product = await products_collection.find_one({"name": entry["item"]})
        # print(products_collection.find())
        documents = await products_collection.find({}).to_list(length=None)
        print("doc----",documents)

        if not product:
            continue
        price = product["unit_price"] * entry["qty"]
        total += price

        print("Product found: ", product)

        bill.append({
            "item": entry["item"],
            "qty": entry["qty"],
            "unit": normalize_unit(entry["unit"]),
            "price": price
        })
    print("Bill items",bill)
    return {"items": bill, "total": total}