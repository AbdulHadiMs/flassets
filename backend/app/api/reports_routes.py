from flask import Blueprint, jsonify, send_file
from flask_jwt_extended import jwt_required
from app.services.reports_export_service import ReportsExportService
from app.services.reports_service import (
    ReportsService
)

reports_bp = Blueprint(
    "reports_bp",
    __name__
)


@reports_bp.route(
    "/reports/assets/status",
    methods=["GET"]
)
@jwt_required()
def asset_status_report():

    report = (
        ReportsService
        .get_asset_status_report()
    )

    return jsonify({
        "success": True,
        "data": report
    }), 200


@reports_bp.route(
    "/reports/assets/category",
    methods=["GET"]
)
@jwt_required()
def asset_category_report():

    report = (
        ReportsService
        .get_asset_category_report()
    )

    return jsonify({
        "success": True,
        "data": report
    }), 200


@reports_bp.route(
    "/reports/employees/assets",
    methods=["GET"]
)
@jwt_required()
def employee_asset_report():

    report = (
        ReportsService
        .get_employee_asset_report()
    )

    return jsonify({
        "success": True,
        "data": report
    }), 200


@reports_bp.route(
    "/reports/allocations",
    methods=["GET"]
)
@jwt_required()
def allocation_history_report():

    report = (
        ReportsService
        .get_allocation_history_report()
    )

    return jsonify({
        "success": True,
        "data": report
    }), 200

@reports_bp.route(
    "/reports/export/assets/status",
    methods=["GET"]
)
@jwt_required()
def export_asset_status_report():

    output = ReportsExportService.create_asset_status_excel()

    return send_file(
        output,
        as_attachment=True,
        download_name="asset_status_report.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

@reports_bp.route(
    "/reports/export/assets/category",
    methods=["GET"]
)
@jwt_required()
def export_asset_category_report():

    output = (
        ReportsExportService
        .create_asset_category_excel()
    )

    return send_file(
        output,
        as_attachment=True,
        download_name="asset_category_report.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )


@reports_bp.route(
    "/reports/export/employees/assets",
    methods=["GET"]
)
@jwt_required()
def export_employee_asset_report():

    output = (
        ReportsExportService
        .create_employee_asset_excel()
    )

    return send_file(
        output,
        as_attachment=True,
        download_name="employee_asset_report.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

@reports_bp.route(
    "/reports/export/assets/all",
    methods=["GET"]
)
@jwt_required()
def export_all_assets_report():

    output = (
        ReportsExportService
        .create_all_assets_excel()
    )

    return send_file(
        output,
        as_attachment=True,
        download_name="all_assets_report.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )