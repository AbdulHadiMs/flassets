from app.models import db
from app.models.base_model import BaseModel


class AssetDamage(BaseModel):
    __tablename__ = "asset_damages"

    asset_id = db.Column(
        db.Integer,
        db.ForeignKey("assets.id"),
        nullable=False
    )

    employee_id = db.Column(
        db.Integer,
        db.ForeignKey("employees.id"),
        nullable=True
    )

    damage_date = db.Column(
        db.Date,
        nullable=False
    )

    damage_description = db.Column(
        db.Text,
        nullable=False
    )

    repair_cost = db.Column(
        db.Float,
        nullable=True
    )

    status = db.Column(
        db.String(50),
        nullable=False,
        default="Open"
    )

    remarks = db.Column(
        db.Text,
        nullable=True
    )

    asset = db.relationship(
        "Asset",
        backref="damage_history"
    )

    employee = db.relationship(
        "Employee",
        backref="asset_damages"
    )

    def __repr__(self):
        return f"<AssetDamage {self.asset_id}>"