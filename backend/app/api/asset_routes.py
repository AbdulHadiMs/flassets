from flask import Blueprint, request, jsonify
from datetime import datetime
from flask_jwt_extended import jwt_required
from app.utils.auth_decorators import admin_required

from app.services.asset_service import AssetService


asset_bp = Blueprint(
    "asset_bp",
    __name__
)


def parse_date(date_string):
    if not date_string:
        return None

    return datetime.strptime(
        date_string,
        "%Y-%m-%d"
    ).date()


@asset_bp.route("/assets", methods=["POST"])
@admin_required
def create_asset():
    try:
        data = request.get_json()

        asset = AssetService.create_asset(
            asset_code=data.get("asset_code"),
            asset_name=data.get("asset_name"),
            category_id=data.get("category_id"),
            vendor_id=data.get("vendor_id"),
            location_id=data.get("location_id"),
            employee_id=data.get("employee_id"),
            serial_number=data.get("serial_number"),
            purchase_date=parse_date(
                data.get("purchase_date")
            ),
            purchase_cost=data.get("purchase_cost"),
            invoice_number=data.get("invoice_number"),
            warranty_expiry=parse_date(
                data.get("warranty_expiry")
            ),
            status=data.get(
                "status",
                "Available"
            )
        )

        return jsonify({
            "success": True,
            "message": "Asset created successfully",
            "data": {
                "id": asset.id,
                "asset_code": asset.asset_code,
                "asset_name": asset.asset_name
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
    
@asset_bp.route("/assets", methods=["GET"])
@jwt_required()
def get_assets():
    try:
        assets = AssetService.get_all_assets()

        return jsonify({
            "success": True,
            "data": [
                {
                    "id": asset.id,
                    "asset_code": asset.asset_code,
                    "asset_name": asset.asset_name,
                    "serial_number": asset.serial_number,
                    "status": asset.status,

                    "category": asset.category.name if asset.category else None,
                    "vendor": asset.vendor.name if asset.vendor else None,
                    "location": asset.location.name if asset.location else None,
                    "employee": asset.employee.full_name if asset.employee else None
                }
                for asset in assets
            ]
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@asset_bp.route("/assets/<int:asset_id>", methods=["GET"])
def get_asset(asset_id):
    try:
        asset = AssetService.get_asset_by_id(asset_id)

        return jsonify({
            "success": True,
            "data": {
                "id": asset.id,
                "asset_code": asset.asset_code,
                "asset_name": asset.asset_name,
                "serial_number": asset.serial_number,
                "purchase_cost": asset.purchase_cost,
                "invoice_number": asset.invoice_number,
                "status": asset.status,

                "category": asset.category.name if asset.category else None,
                "vendor": asset.vendor.name if asset.vendor else None,
                "location": asset.location.name if asset.location else None,
                "employee": asset.employee.full_name if asset.employee else None
            }
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404


@asset_bp.route("/assets/<int:asset_id>", methods=["PUT"])
@admin_required
def update_asset(asset_id):
    try:
        data = request.get_json()

        asset = AssetService.update_asset(
            asset_id=asset_id,
            asset_code=data.get("asset_code"),
            asset_name=data.get("asset_name"),
            category_id=data.get("category_id"),
            vendor_id=data.get("vendor_id"),
            location_id=data.get("location_id"),
            employee_id=data.get("employee_id"),
            serial_number=data.get("serial_number"),
            purchase_date=parse_date(
                data.get("purchase_date")
            ),
            purchase_cost=data.get("purchase_cost"),
            invoice_number=data.get("invoice_number"),
            warranty_expiry=parse_date(
                data.get("warranty_expiry")
            ),
            status=data.get(
                "status",
                "Available"
            )
        )

        return jsonify({
            "success": True,
            "message": "Asset updated successfully",
            "data": {
                "id": asset.id,
                "asset_code": asset.asset_code,
                "asset_name": asset.asset_name
            }
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@asset_bp.route("/assets/<int:asset_id>", methods=["DELETE"])
@admin_required
def delete_asset(asset_id):
    try:
        AssetService.delete_asset(asset_id)

        return jsonify({
            "success": True,
            "message": "Asset removed successfully"
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404








