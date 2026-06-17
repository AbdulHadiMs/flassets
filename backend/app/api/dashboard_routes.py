from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.services.dashboard_service import (
    DashboardService
)

dashboard_bp = Blueprint(
    "dashboard_bp",
    __name__
)


@dashboard_bp.route(
    "/dashboard/stats",
    methods=["GET"]
)
@jwt_required()
def get_dashboard_stats():

    stats = DashboardService.get_dashboard_stats()

    return jsonify({
        "success": True,
        "data": stats
    }), 200

@dashboard_bp.route(
    "/dashboard/recent-assets",
    methods=["GET"]
)
@jwt_required()
def get_recent_assets():

    assets = DashboardService.get_recent_assets()

    return jsonify({
        "success": True,
        "data": assets
    }), 200


@dashboard_bp.route(
    "/dashboard/recent-allocations",
    methods=["GET"]
)
@jwt_required()
def get_recent_allocations():

    allocations = (
        DashboardService.get_recent_allocations()
    )

    return jsonify({
        "success": True,
        "data": allocations
    }), 200