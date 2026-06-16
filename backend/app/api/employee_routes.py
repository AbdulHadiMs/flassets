from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.utils.auth_decorators import admin_required

from app.services.employee_service import EmployeeService


employee_bp = Blueprint(
    "employee_bp",
    __name__
)


@employee_bp.route("/employees", methods=["POST"])
@admin_required
def create_employee():
    try:
        data = request.get_json()

        employee = EmployeeService.create_employee(
            employee_code=data.get("employee_code"),
            full_name=data.get("full_name"),
            email=data.get("email"),
            phone=data.get("phone"),
            department=data.get("department"),
            designation=data.get("designation")
        )

        return jsonify({
            "success": True,
            "message": "Employee created successfully",
            "data": {
                "id": employee.id,
                "employee_code": employee.employee_code,
                "full_name": employee.full_name
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


@employee_bp.route("/employees", methods=["GET"])
@jwt_required()
def get_employees():
    try:
        employees = EmployeeService.get_all_employees()

        return jsonify({
            "success": True,
            "data": [
                {
                    "id": employee.id,
                    "employee_code": employee.employee_code,
                    "full_name": employee.full_name,
                    "email": employee.email,
                    "phone": employee.phone,
                    "department": employee.department,
                    "designation": employee.designation
                }
                for employee in employees
            ]
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@employee_bp.route("/employees/<int:employee_id>", methods=["GET"])
def get_employee(employee_id):
    try:
        employee = EmployeeService.get_employee_by_id(
            employee_id
        )

        return jsonify({
            "success": True,
            "data": {
                "id": employee.id,
                "employee_code": employee.employee_code,
                "full_name": employee.full_name,
                "email": employee.email,
                "phone": employee.phone,
                "department": employee.department,
                "designation": employee.designation
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


@employee_bp.route("/employees/<int:employee_id>", methods=["PUT"])
@admin_required
def update_employee(employee_id):
    try:
        data = request.get_json()

        employee = EmployeeService.update_employee(
            employee_id=employee_id,
            employee_code=data.get("employee_code"),
            full_name=data.get("full_name"),
            email=data.get("email"),
            phone=data.get("phone"),
            department=data.get("department"),
            designation=data.get("designation")
        )

        return jsonify({
            "success": True,
            "message": "Employee updated successfully",
            "data": {
                "id": employee.id,
                "employee_code": employee.employee_code,
                "full_name": employee.full_name
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


@employee_bp.route("/employees/<int:employee_id>", methods=["DELETE"])
@admin_required
def deactivate_employee(employee_id):
    try:
        EmployeeService.deactivate_employee(
            employee_id
        )

        return jsonify({
            "success": True,
            "message": "Employee deactivated successfully"
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