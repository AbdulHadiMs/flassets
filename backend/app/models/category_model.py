from app.models import db
from app.models.base_model import BaseModel


class Category(BaseModel):
    __tablename__ = "categories"

    name = db.Column(
        db.String(100),
        unique=True,
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
        return f"<Category {self.name}>"