from app import db

from app.models.asset_model import Asset
from app.models.employee_model import Employee
from app.models.asset_allocation_model import AssetAllocation
from datetime import date, datetime


class AssetAllocationService:

    @staticmethod
    def allocate_asset(
        asset_id,
        employee_id,
        allocation_date,
        expected_return_date=None,
        remarks=None
    ):

        asset = Asset.query.get(asset_id)

        if not asset:
            raise ValueError("Asset not found")

        employee = Employee.query.get(employee_id)

        if not employee:
            raise ValueError("Employee not found")

        if asset.status == "Allocated":
            raise ValueError(
                "Asset is already allocated"
            )

        try:
            allocation_date = datetime.strptime(
                allocation_date,
                "%Y-%m-%d"
            ).date()

            if expected_return_date:
                expected_return_date = datetime.strptime(
                    expected_return_date,
                    "%Y-%m-%d"
                ).date()
            else:
                expected_return_date = None

        except ValueError:
            raise ValueError(
                "Dates must be in YYYY-MM-DD format"
            )

        allocation = AssetAllocation(
            asset_id=asset_id,
            employee_id=employee_id,
            allocation_date=allocation_date,
            expected_return_date=expected_return_date,
            remarks=remarks,
            status="Allocated"
        )

        # Update current asset state
        asset.status = "Allocated"
        asset.employee_id = employee_id

        db.session.add(allocation)
        db.session.commit()

        return allocation


    @staticmethod
    def return_asset(
        allocation_id
    ):

        allocation = AssetAllocation.query.get(
            allocation_id
        )

        if not allocation:
            raise ValueError(
                "Allocation not found"
            )

        if allocation.status == "Returned":
            raise ValueError(
                "Asset already returned"
            )

        allocation.status = "Returned"

        allocation.actual_return_date = date.today()

        allocation.asset.status = "Available"
        allocation.asset.employee_id = None

        db.session.commit()

        return allocation       


    @staticmethod
    def get_all_allocations():

        return AssetAllocation.query.order_by(
            AssetAllocation.created_at.desc()
        ).all()
    

    @staticmethod
    def get_employee_allocations(
        employee_id
    ):

        return AssetAllocation.query.filter_by(
            employee_id=employee_id
        ).all()