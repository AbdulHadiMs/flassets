from app.models import db
from app.models.base_model import BaseModel


class Location(BaseModel):
    __tablename__ = "locations"

    name = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    def __repr__(self):
        return f"<Location {self.name}>"