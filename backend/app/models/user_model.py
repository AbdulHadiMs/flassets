from app.models import db
from app.models.base_model import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    full_name = db.Column(
        db.String(150),
        nullable=False
    )

    email = db.Column(
        db.String(150),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
    db.String(50),
    nullable=False,
    default="Employee"
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    def __repr__(self):
        return f"<User {self.email}>"