from app import db
from flask_jwt_extended import create_access_token

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
    
    @staticmethod
    def login_user(
        email,
        password
    ):
        user = User.query.filter_by(
            email=email,
            is_active=True
        ).first()

        if not user:
            raise ValueError(
                "Invalid email or password"
            )

        if not verify_password(
            password,
            user.password_hash
        ):
            raise ValueError(
                "Invalid email or password"
            )

        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "email": user.email,
                "role": user.role
            }
        )

        return {
            "token": access_token,
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role
            }
        }