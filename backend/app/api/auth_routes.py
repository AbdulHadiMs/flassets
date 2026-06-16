from flask import Blueprint, request, jsonify

from app.services.auth_service import AuthService


auth_bp = Blueprint(
    "auth_bp",
    __name__
)


@auth_bp.route(
    "/auth/register",
    methods=["POST"]
)
def register():
    try:
        data = request.get_json()

        user = AuthService.register_user(
            full_name=data.get("full_name"),
            email=data.get("email"),
            password=data.get("password"),
            role=data.get(
                "role",
                "Employee"
            )
        )

        return jsonify({
            "success": True,
            "message": "User registered successfully",
            "data": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role
            }
        }), 201

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@auth_bp.route(
    "/auth/login",
    methods=["POST"]
)
def login():
    try:
        data = request.get_json()

        result = AuthService.login_user(
            email=data.get("email"),
            password=data.get("password")
        )

        return jsonify({
            "success": True,
            "message": "Login successful",
            "data": result
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 401