from flask import Blueprint, request, jsonify

from app.services.location_service import LocationService


location_bp = Blueprint(
    "location_bp",
    __name__
)


@location_bp.route("/locations", methods=["POST"])
def create_location():
    try:
        data = request.get_json()

        location = LocationService.create_location(
            name=data.get("name"),
            description=data.get("description")
        )

        return jsonify({
            "success": True,
            "message": "Location created successfully",
            "data": {
                "id": location.id,
                "name": location.name,
                "description": location.description
            }
        }), 201

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@location_bp.route("/locations", methods=["GET"])
def get_locations():
    try:
        locations = LocationService.get_all_locations()

        return jsonify({
            "success": True,
            "data": [
                {
                    "id": location.id,
                    "name": location.name,
                    "description": location.description
                }
                for location in locations
            ]
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@location_bp.route("/locations/<int:location_id>", methods=["GET"])
def get_location(location_id):
    try:
        location = LocationService.get_location_by_id(
            location_id
        )

        return jsonify({
            "success": True,
            "data": {
                "id": location.id,
                "name": location.name,
                "description": location.description
            }
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404


@location_bp.route("/locations/<int:location_id>", methods=["PUT"])
def update_location(location_id):
    try:
        data = request.get_json()

        location = LocationService.update_location(
            location_id=location_id,
            name=data.get("name"),
            description=data.get("description")
        )

        return jsonify({
            "success": True,
            "message": "Location updated successfully",
            "data": {
                "id": location.id,
                "name": location.name,
                "description": location.description
            }
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@location_bp.route("/locations/<int:location_id>", methods=["DELETE"])
def deactivate_location(location_id):
    try:
        LocationService.deactivate_location(
            location_id
        )

        return jsonify({
            "success": True,
            "message": "Location deactivated successfully"
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404