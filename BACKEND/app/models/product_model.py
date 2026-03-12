from pydantic import BaseModel
from typing import List
from typing import Optional

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

class AddProduct(BaseModel):
    product_name : str
    price : float
    unit : str

class UpdateProduct(BaseModel):
    product_name: str
    price: Optional[float] = None
    unit: Optional[str] = None

    