from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.services.category_service import CategoryService


category_bp = Blueprint(
    "category_bp",
    __name__
)


@category_bp.route(
    "/categories",
    methods=["POST"]
)
def create_category():
    try:
        data = request.get_json()

        name = data.get("name")
        description = data.get("description")

        if not name:
            return jsonify({
                "success": False,
                "message": "Category name is required"
            }), 400

        category = CategoryService.create_category(
            name=name,
            description=description
        )

        return jsonify({
            "success": True,
            "message": "Category created successfully",
            "data": {
                "id": category.id,
                "name": category.name,
                "description": category.description
            }
        }), 201

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@category_bp.route(
    "/categories",
    methods=["GET"]
)
@jwt_required()
def get_categories():
    try:
        categories = CategoryService.get_all_categories()

        return jsonify({
            "success": True,
            "data": [
                {
                    "id": category.id,
                    "name": category.name,
                    "description": category.description
                }
                for category in categories
            ]
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@category_bp.route(
    "/categories/<int:category_id>",
    methods=["GET"]
)
def get_category(category_id):
    try:
        category = CategoryService.get_category_by_id(
            category_id
        )

        return jsonify({
            "success": True,
            "data": {
                "id": category.id,
                "name": category.name,
                "description": category.description
            }
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@category_bp.route(
    "/categories/<int:category_id>",
    methods=["PUT"]
)
def update_category(category_id):
    try:
        data = request.get_json()

        category = CategoryService.update_category(
            category_id=category_id,
            name=data.get("name"),
            description=data.get("description")
        )

        return jsonify({
            "success": True,
            "message": "Category updated successfully",
            "data": {
                "id": category.id,
                "name": category.name,
                "description": category.description
            }
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@category_bp.route(
    "/categories/<int:category_id>",
    methods=["DELETE"]
)
def deactivate_category(category_id):
    try:
        CategoryService.deactivate_category(
            category_id
        )

        return jsonify({
            "success": True,
            "message": "Category deactivated successfully"
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    


