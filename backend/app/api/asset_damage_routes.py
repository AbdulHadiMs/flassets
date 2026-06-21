from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.services.asset_damage_service import AssetDamageService


damage_bp = Blueprint(
    "damage_bp",
    __name__
)


@damage_bp.route(
    "/damages",
    methods=["POST"]
)
@jwt_required()
def report_damage():
    try:
        data = request.get_json()

        damage = AssetDamageService.report_damage(
            asset_id=data.get("asset_id"),
            employee_id=data.get("employee_id"),
            damage_date=data.get("damage_date"),
            damage_description=data.get("damage_description"),
            repair_cost=data.get("repair_cost"),
            remarks=data.get("remarks")
        )

        return jsonify({
            "success": True,
            "message": "Damage reported successfully",
            "data": {
                "id": damage.id
            }
        }), 201

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@damage_bp.route(
    "/damages/<int:damage_id>/repair",
    methods=["PUT"]
)
@jwt_required()
def mark_repaired(damage_id):
    try:
        damage = AssetDamageService.mark_repaired(
            damage_id
        )

        return jsonify({
            "success": True,
            "message": "Asset marked as repaired",
            "data": {
                "id": damage.id
            }
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@damage_bp.route(
    "/assets/<int:asset_id>/damages",
    methods=["GET"]
)
@jwt_required()
def get_asset_damage_history(asset_id):

    damages = AssetDamageService.get_asset_damage_history(
        asset_id
    )

    return jsonify({
        "success": True,
        "data": [
            {
                "id": damage.id,
                "employee_name": damage.employee.full_name
                if damage.employee else None,
                "damage_date": str(damage.damage_date),
                "damage_description": damage.damage_description,
                "repair_cost": damage.repair_cost,
                "status": damage.status,
                "remarks": damage.remarks
            }
            for damage in damages
        ]
    }), 200



@damage_bp.route(
    "/damages",
    methods=["GET"]
)
@jwt_required()
def get_all_damages():

    damages = (
        AssetDamageService
        .get_all_damages()
    )

    return jsonify({
        "success": True,
        "data": [
            {
                "id": damage.id,

                "asset_id": damage.asset_id,
                "asset_code": damage.asset.asset_code
                if damage.asset else None,
                "asset_name": damage.asset.asset_name
                if damage.asset else None,

                "employee_name": damage.employee.full_name
                if damage.employee else None,

                "damage_date": str(damage.damage_date),
                "damage_description": damage.damage_description,
                "repair_cost": damage.repair_cost,
                "status": damage.status,
                "remarks": damage.remarks
            }
            for damage in damages
        ]
    }), 200