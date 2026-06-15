from app.models import db
from app.models.base_model import BaseModel


class Employee(BaseModel):
    __tablename__ = "employees"

    employee_code = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    full_name = db.Column(
        db.String(150),
        nullable=False
    )

    email = db.Column(
        db.String(150),
        unique=True,
        nullable=True
    )

    phone = db.Column(
        db.String(30),
        nullable=True
    )

    department = db.Column(
        db.String(100),
        nullable=True
    )

    designation = db.Column(
        db.String(100),
        nullable=True
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    def __repr__(self):
        return f"<Employee {self.employee_code}>"