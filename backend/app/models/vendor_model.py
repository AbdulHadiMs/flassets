from app.models import db
from app.models.base_model import BaseModel


class Vendor(BaseModel):
    __tablename__ = "vendors"

    name = db.Column(
        db.String(150),
        nullable=False
    )

    contact_person = db.Column(
        db.String(150),
        nullable=True
    )

    email = db.Column(
        db.String(150),
        nullable=True
    )

    phone = db.Column(
        db.String(30),
        nullable=True
    )

    address = db.Column(
        db.Text,
        nullable=True
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    def __repr__(self):
        return f"<Vendor {self.name}>"