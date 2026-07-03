from app import db
import re
from app.models.asset_model import Asset
from app.models.category_model import Category
from app.models.vendor_model import Vendor
from app.models.location_model import Location
from app.models.employee_model import Employee


class AssetService:

    @staticmethod
    def create_asset(
        asset_code,
        asset_name,
        category_id,
        vendor_id=None,
        location_id=None,
        employee_id=None,
        serial_number=None,
        purchase_date=None,
        purchase_cost=None,
        invoice_number=None,
        warranty_expiry=None,
        status="Available"
    ):

        existing_asset = Asset.query.filter_by(
            asset_code=asset_code,
            is_active=True
        ).first()

        if existing_asset:
            raise ValueError(
                "Asset code already exists"
            )

        if serial_number:
            existing_serial = Asset.query.filter_by(
                serial_number=serial_number,
                is_active=True
            ).first()

            if existing_serial:
                raise ValueError(
                    "Serial number already exists"
                )

        category = Category.query.get(
            category_id
        )

        if not category:
            raise ValueError(
                "Category not found"
            )

        if vendor_id:
            vendor = Vendor.query.get(
                vendor_id
            )

            if not vendor:
                raise ValueError(
                    "Vendor not found"
                )

        if location_id:
            location = Location.query.get(
                location_id
            )

            if not location:
                raise ValueError(
                    "Location not found"
                )

        if employee_id:
            employee = Employee.query.get(
                employee_id
            )

            if not employee:
                raise ValueError(
                    "Employee not found"
                )

        asset = Asset(
            asset_code=asset_code,
            asset_name=asset_name,
            category_id=category_id,
            vendor_id=vendor_id,
            location_id=location_id,
            employee_id=employee_id,
            serial_number=serial_number,
            purchase_date=purchase_date,
            purchase_cost=purchase_cost,
            invoice_number=invoice_number,
            warranty_expiry=warranty_expiry,
            status=status
        )

        db.session.add(asset)
        db.session.commit()

        return asset
    
    @staticmethod
    def get_all_assets():
        return Asset.query.filter_by(
            is_active=True
        ).order_by(
            Asset.asset_name
        ).all()
    
    @staticmethod
    def get_asset_by_id(asset_id):
        asset = Asset.query.get(asset_id)

        if not asset:
            raise ValueError(
                "Asset not found"
            )

        return asset
    
    @staticmethod
    def update_asset(
        asset_id,
        asset_code,
        asset_name,
        category_id,
        vendor_id=None,
        location_id=None,
        employee_id=None,
        serial_number=None,
        purchase_date=None,
        purchase_cost=None,
        invoice_number=None,
        warranty_expiry=None,
        status="Available"
    ):
        asset = Asset.query.get(asset_id)

        if not asset:
            raise ValueError(
                "Asset not found"
            )

        duplicate_code = Asset.query.filter(
            Asset.asset_code == asset_code,
            Asset.id != asset_id
        ).first()

        if duplicate_code:
            raise ValueError(
                "Asset code already exists"
            )

        if serial_number:
            duplicate_serial = Asset.query.filter(
                Asset.serial_number == serial_number,
                Asset.id != asset_id
            ).first()

            if duplicate_serial:
                raise ValueError(
                    "Serial number already exists"
                )

        asset.asset_code = asset_code
        asset.asset_name = asset_name
        asset.category_id = category_id
        asset.vendor_id = vendor_id
        asset.location_id = location_id
        asset.employee_id = employee_id
        asset.serial_number = serial_number
        asset.purchase_date = purchase_date
        asset.purchase_cost = purchase_cost
        asset.invoice_number = invoice_number
        asset.warranty_expiry = warranty_expiry
        if employee_id:
            asset.status = "Allocated"
        else:
            asset.status = status

        db.session.commit()

        return asset

    
    @staticmethod
    def delete_asset(asset_id):
        asset = Asset.query.get(asset_id)

        if not asset:
            raise ValueError(
                "Asset not found"
            )

        asset.is_active = False
        db.session.commit()

    @staticmethod
    def get_asset_details(asset_id):

        asset = Asset.query.get(asset_id)

        if not asset:
            raise ValueError("Asset not found")

        return asset
    
    
    @staticmethod
    def get_asset_history(asset_id):

        from app.models.asset_allocation_model import (
            AssetAllocation
        )

        return AssetAllocation.query.filter_by(
            asset_id=asset_id
        ).all()
    
    @staticmethod
    def generate_asset_code(category_id):

        category = Category.query.get(category_id)

        if not category:
            raise ValueError("Category not found")

        prefix = category.code_prefix

        if not prefix:
            raise ValueError(
                "Category prefix is not configured"
            )

        assets = Asset.query.filter_by(
            category_id=category_id
        ).all()

        max_number = 0

        for asset in assets:

            if not asset.asset_code:
                continue

            match = re.search(
                r"(\d+)$",
                asset.asset_code
            )

            if match:
                number = int(match.group(1))

                if number > max_number:
                    max_number = number

        next_number = max_number + 1

        return f"{prefix}_{next_number:03d}"
    
    