from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.utils.auth_decorators import admin_required

from app.services.vendor_service import VendorService


vendor_bp = Blueprint(
    "vendor_bp",
    __name__
)


@vendor_bp.route("/vendors", methods=["POST"])
@admin_required
def create_vendor():
    try:
        data = request.get_json()

        vendor = VendorService.create_vendor(
            name=data.get("name"),
            contact_person=data.get("contact_person"),
            email=data.get("email"),
            phone=data.get("phone"),
            address=data.get("address")
        )

        return jsonify({
            "success": True,
            "message": "Vendor created successfully",
            "data": {
                "id": vendor.id,
                "name": vendor.name
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


@vendor_bp.route("/vendors", methods=["GET"])
@jwt_required()
def get_vendors():
    try:
        vendors = VendorService.get_all_vendors()

        return jsonify({
            "success": True,
            "data": [
                {
                    "id": vendor.id,
                    "name": vendor.name,
                    "contact_person": vendor.contact_person,
                    "email": vendor.email,
                    "phone": vendor.phone,
                    "address": vendor.address
                }
                for vendor in vendors
            ]
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@vendor_bp.route("/vendors/<int:vendor_id>", methods=["GET"])
def get_vendor(vendor_id):
    try:
        vendor = VendorService.get_vendor_by_id(
            vendor_id
        )

        return jsonify({
            "success": True,
            "data": {
                "id": vendor.id,
                "name": vendor.name,
                "contact_person": vendor.contact_person,
                "email": vendor.email,
                "phone": vendor.phone,
                "address": vendor.address
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


@vendor_bp.route("/vendors/<int:vendor_id>", methods=["PUT"])
@admin_required
def update_vendor(vendor_id):
    try:
        data = request.get_json()

        vendor = VendorService.update_vendor(
            vendor_id=vendor_id,
            name=data.get("name"),
            contact_person=data.get("contact_person"),
            email=data.get("email"),
            phone=data.get("phone"),
            address=data.get("address")
        )

        return jsonify({
            "success": True,
            "message": "Vendor updated successfully",
            "data": {
                "id": vendor.id,
                "name": vendor.name
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


@vendor_bp.route("/vendors/<int:vendor_id>", methods=["DELETE"])
@admin_required
def deactivate_vendor(vendor_id):
    try:
        VendorService.deactivate_vendor(
            vendor_id
        )

        return jsonify({
            "success": True,
            "message": "Vendor deactivated successfully"
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