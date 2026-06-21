import pandas as pd

from app import create_app, db

from app.models.asset_model import Asset
from app.models.category_model import Category
from app.models.vendor_model import Vendor
from app.models.location_model import Location
from app.models.employee_model import Employee

app = create_app()

with app.app_context():

    df = pd.read_excel("import_data/assets.xlsx")

    imported = 0
    skipped = 0

    for _, row in df.iterrows():

        # Asset Code
        asset_code = str(row["asset_code"]).strip()

        existing_asset = Asset.query.filter_by(
            asset_code=asset_code
        ).first()

        if existing_asset:
            print(f"Skipped existing asset code: {asset_code}")
            skipped += 1
            continue

        # Serial Number
        serial_number = None

        if not pd.isna(row["serial_number"]):
            serial_number = str(row["serial_number"]).strip()

            existing_serial = Asset.query.filter_by(
                serial_number=serial_number
            ).first()

            if existing_serial:
                print(f"Skipped duplicate serial: {serial_number}")
                skipped += 1
                continue

        # Category (Required)
        category = Category.query.filter_by(
            name=str(row["category"]).strip()
        ).first()

        if not category:
            print(f"Category not found: {row['category']}")
            skipped += 1
            continue

        # Vendor (Optional)
        vendor = None

        if not pd.isna(row["vendor"]):
            vendor = Vendor.query.filter_by(
                name=str(row["vendor"]).strip()
            ).first()

        # Location (Optional)
        location = None

        if not pd.isna(row["location"]):
            location = Location.query.filter_by(
                name=str(row["location"]).strip()
            ).first()

        # Employee (Optional)
        employee = None

        if not pd.isna(row["employee_code"]):
            employee = Employee.query.filter_by(
                employee_code=str(row["employee_code"]).strip()
            ).first()

        # Dates
        purchase_date = None

        if not pd.isna(row["purchase_date"]):
            purchase_date = pd.to_datetime(
                row["purchase_date"]
            ).date()

        warranty_expiry = None

        if not pd.isna(row["warranty_expiry"]):
            warranty_expiry = pd.to_datetime(
                row["warranty_expiry"]
            ).date()

        # Cost
        purchase_cost = None

        if not pd.isna(row["purchase_cost"]):
            purchase_cost = float(row["purchase_cost"])

        # Asset Object
        asset = Asset(
            asset_code=asset_code,
            asset_name=str(row["asset_name"]).strip(),
            serial_number=serial_number,
            purchase_date=purchase_date,
            purchase_cost=purchase_cost,
            invoice_number=(
                str(row["invoice_number"]).strip()
                if not pd.isna(row["invoice_number"])
                else None
            ),
            warranty_expiry=warranty_expiry,
            status=(
                str(row["status"]).strip()
                if not pd.isna(row["status"])
                else "Available"
            ),
            purchase_condition=(
                str(row["purchase_condition"]).strip()
                if not pd.isna(row["purchase_condition"])
                else None
            ),
            category_id=category.id,
            vendor_id=vendor.id if vendor else None,
            location_id=location.id if location else None,
            employee_id=employee.id if employee else None,
            is_active=True
        )

        db.session.add(asset)
        imported += 1

    db.session.commit()

    print("\n====================")
    print(f"Imported : {imported}")
    print(f"Skipped  : {skipped}")
    print("====================")
    print("Assets imported successfully")