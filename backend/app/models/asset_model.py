from app.models import db
from app.models.base_model import BaseModel


class Asset(BaseModel):
    __tablename__ = "assets"

    asset_code = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    asset_name = db.Column(
        db.String(200),
        nullable=False
    )

    serial_number = db.Column(
        db.String(150),
        unique=True,
        nullable=True
    )

    purchase_date = db.Column(
        db.Date,
        nullable=True
    )

    purchase_cost = db.Column(
        db.Float,
        nullable=True
    )

    invoice_number = db.Column(
        db.String(100),
        nullable=True
    )

    warranty_expiry = db.Column(
        db.Date,
        nullable=True
    )

    status = db.Column(
        db.String(50),
        nullable=False,
        default="Available"
    )

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.id"),
        nullable=False
    )

    vendor_id = db.Column(
        db.Integer,
        db.ForeignKey("vendors.id"),
        nullable=True
    )

    location_id = db.Column(
        db.Integer,
        db.ForeignKey("locations.id"),
        nullable=True
    )

    employee_id = db.Column(
        db.Integer,
        db.ForeignKey("employees.id"),
        nullable=True
    )

    category = db.relationship(
        "Category",
        backref="assets"
    )

    vendor = db.relationship(
        "Vendor",
        backref="assets"
    )

    location = db.relationship(
        "Location",
        backref="assets"
    )

    employee = db.relationship(
        "Employee",
        backref="assets"
    )
    
    allocations = db.relationship(
        "AssetAllocation",
        backref="asset",
        lazy=True
    )
    
    is_active = db.Column(
        db.Boolean,
        default=True
    )
    

    def __repr__(self):
        return f"<Asset {self.asset_code}>"