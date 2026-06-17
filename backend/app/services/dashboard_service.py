from app.models.asset_model import Asset
from app.models.employee_model import Employee
from app.models.vendor_model import Vendor
from app.models.category_model import Category
from app.models.location_model import Location
from app.models.asset_allocation_model import AssetAllocation


class DashboardService:

    @staticmethod
    def get_dashboard_stats():

        total_assets = Asset.query.filter_by(
            is_active=True
        ).count()

        available_assets = Asset.query.filter_by(
            is_active=True,
            status="Available"
        ).count()

        allocated_assets = Asset.query.filter_by(
            is_active=True,
            status="Allocated"
        ).count()

        maintenance_assets = Asset.query.filter_by(
            is_active=True,
            status="Maintenance"
        ).count()

        total_employees = Employee.query.filter_by(
            is_active=True
        ).count()

        total_vendors = Vendor.query.filter_by(
            is_active=True
        ).count()

        total_categories = Category.query.filter_by(
            is_active=True
        ).count()

        total_locations = Location.query.filter_by(
            is_active=True
        ).count()

        active_allocations = AssetAllocation.query.filter_by(
            status="Allocated"
        ).count()

        return {
            "total_assets": total_assets,
            "available_assets": available_assets,
            "allocated_assets": allocated_assets,
            "maintenance_assets": maintenance_assets,
            "total_employees": total_employees,
            "total_vendors": total_vendors,
            "total_categories": total_categories,
            "total_locations": total_locations,
            "active_allocations": active_allocations
        }
    

    @staticmethod
    def get_recent_assets():
        assets = Asset.query.filter_by(
            is_active=True
        ).order_by(
            Asset.created_at.desc()
        ).limit(5).all()

        return [
            {
                "id": asset.id,
                "asset_code": asset.asset_code,
                "asset_name": asset.asset_name,
                "status": asset.status
            }
            for asset in assets
        ]
    
    @staticmethod
    def get_recent_allocations():
        allocations = AssetAllocation.query.order_by(
            AssetAllocation.created_at.desc()
        ).limit(5).all()

        return [
            {
                "id": allocation.id,
                "asset_code": allocation.asset.asset_code
                if allocation.asset else None,
                "asset_name": allocation.asset.asset_name
                if allocation.asset else None,
                "employee_name": allocation.employee.full_name
                if allocation.employee else None,
                "allocation_date": str(allocation.allocation_date),
                "status": allocation.status
            }
            for allocation in allocations
        ]