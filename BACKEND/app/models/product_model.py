from pydantic import BaseModel
from typing import List

class Product(BaseModel):
    name: str
    unit_price: float
    unit: str

class BillingRequest(BaseModel):
    text: str

class BillItem(BaseModel):
    item: str
    qty: float
    unit: str
    price: float

class SavePurchase(BaseModel):
    name: str
    phone: str
    items: List[BillItem]
    total: float
