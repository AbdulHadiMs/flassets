from app.models import db
from app.models.base_model import BaseModel


class AssetAllocation(BaseModel):
    __tablename__ = "asset_allocations"

    asset_id = db.Column(
        db.Integer,
        db.ForeignKey("assets.id"),
        nullable=False
    )

    employee_id = db.Column(
        db.Integer,
        db.ForeignKey("employees.id"),
        nullable=False
    )

    allocation_date = db.Column(
        db.Date,
        nullable=False
    )

    expected_return_date = db.Column(
        db.Date,
        nullable=True
    )

    actual_return_date = db.Column(
        db.Date,
        nullable=True
    )

    remarks = db.Column(
        db.Text,
        nullable=True
    )

    status = db.Column(
        db.String(50),
        default="Allocated"
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    def __repr__(self):
        return f"<AssetAllocation {self.id}>"