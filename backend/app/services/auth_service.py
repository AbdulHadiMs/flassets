from app import db

from app.models.user_model import User
from app.utils.security import (
    hash_password,
    verify_password
)


class AuthService:

    @staticmethod
    def register_user(
        full_name,
        email,
        password,
        role="Employee"
    ):

        existing_user = User.query.filter_by(
            email=email
        ).first()

        if existing_user:
            raise ValueError(
                "Email already registered"
            )

        user = User(
            full_name=full_name,
            email=email,
            password_hash=hash_password(
                password
            ),
            role=role
        )

        db.session.add(user)
        db.session.commit()

        return user