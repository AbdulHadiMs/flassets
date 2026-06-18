from app.models.asset_model import Asset
from app.models.category_model import Category
from app.models.asset_allocation_model import AssetAllocation


class ReportsService:

    @staticmethod
    def get_asset_status_report():
        statuses = [
            "Available",
            "Allocated",
            "Maintenance",
            "Disposed"
        ]

        report = []

        for status in statuses:
            count = Asset.query.filter_by(
                is_active=True,
                status=status
            ).count()

            report.append({
                "status": status,
                "count": count
            })

        return report

    @staticmethod
    def get_asset_category_report():
        categories = Category.query.filter_by(
            is_active=True
        ).all()

        report = []

        for category in categories:
            count = Asset.query.filter_by(
                is_active=True,
                category_id=category.id
            ).count()

            report.append({
                "category": category.name,
                "count": count
            })

        return report
    
    @staticmethod
    def get_employee_asset_report():
        from app.models.employee_model import Employee
        from app.models.asset_model import Asset

        employees = Employee.query.filter_by(
            is_active=True
        ).all()

        report = []

        for employee in employees:
            count = Asset.query.filter_by(
                is_active=True,
                employee_id=employee.id
            ).count()

            report.append({
                "employee": employee.full_name,
                "employee_code": employee.employee_code,
                "asset_count": count
            })

        return report
    
    @staticmethod
    def get_allocation_history_report():

        allocations = AssetAllocation.query.all()

        report = []

        for allocation in allocations:

            report.append({
                "id": allocation.id,

                "asset_code":
                    allocation.asset.asset_code
                    if allocation.asset else None,

                "asset_name":
                    allocation.asset.asset_name
                    if allocation.asset else None,

                "employee_name":
                    allocation.employee.full_name
                    if allocation.employee else None,

                "status":
                    allocation.status,

                "allocation_date":
                    str(allocation.allocation_date)
                    if allocation.allocation_date
                    else None,

                "expected_return_date":
                    str(allocation.expected_return_date)
                    if allocation.expected_return_date
                    else None,

                "actual_return_date":
                    str(allocation.actual_return_date)
                    if allocation.actual_return_date
                    else None
            })

        return report