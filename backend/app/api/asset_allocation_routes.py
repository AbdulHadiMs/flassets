from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.services.asset_allocation_service import (
    AssetAllocationService
)

allocation_bp = Blueprint(
    "allocation_bp",
    __name__
)

@allocation_bp.route(
    "/allocations",
    methods=["POST"]
)
@jwt_required()
def allocate_asset():
    try:
        data = request.get_json()

        allocation = (
            AssetAllocationService.allocate_asset(
                asset_id=data.get("asset_id"),
                employee_id=data.get("employee_id"),
                allocation_date=data.get(
                    "allocation_date"
                ),
                expected_return_date=data.get(
                    "expected_return_date"
                ),
                remarks=data.get("remarks")
            )
        )

        return jsonify({
            "success": True,
            "message": "Asset allocated successfully",
            "data": {
                "id": allocation.id
            }
        }), 201

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400
    

    
@allocation_bp.route(
    "/allocations/<int:allocation_id>/return",
    methods=["PUT"]
)
@jwt_required()
def return_asset(
    allocation_id
):
    try:

        allocation = (
            AssetAllocationService.return_asset(
                allocation_id
            )
        )

        return jsonify({
            "success": True,
            "message": "Asset returned successfully",
            "data": {
                "id": allocation.id
            }
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400
    


@allocation_bp.route(
    "/allocations",
    methods=["GET"]
)
@jwt_required()
def get_allocations():

    allocations = (
        AssetAllocationService.get_all_allocations()
    )

    data = []

    for allocation in allocations:
        data.append({
            "id": allocation.id,

            "asset_id": allocation.asset_id,
            "asset_code": allocation.asset.asset_code if allocation.asset else None,
            "asset_name": allocation.asset.asset_name if allocation.asset else None,

            "employee_id": allocation.employee_id,
            "employee_name": allocation.employee.full_name if allocation.employee else None,

            "status": allocation.status,

            "allocation_date": str(allocation.allocation_date),

            "expected_return_date": str(allocation.expected_return_date)
            if allocation.expected_return_date
            else None,

            "actual_return_date": str(allocation.actual_return_date)
            if allocation.actual_return_date
            else None,
        })

    return jsonify({
        "success": True,
        "data": data
    }), 200



@allocation_bp.route(
    "/employees/<int:employee_id>/allocations",
    methods=["GET"]
)
@jwt_required()
def employee_allocations(
    employee_id
):

    allocations = (
        AssetAllocationService
        .get_employee_allocations(
            employee_id
        )
    )

    data = []

    for allocation in allocations:
        data.append({
            "id": allocation.id,
            "asset_id": allocation.asset_id,
            "status": allocation.status
        })

    return jsonify({
        "success": True,
        "data": data
    }), 200

