import re
import pandas as pd

from app import create_app, db
from app.models.asset_model import Asset
from app.models.category_model import Category
from app.models.vendor_model import Vendor
from app.models.location_model import Location
from app.models.employee_model import Employee


app = create_app()


def clean(value):
    if pd.isna(value):
        return None

    value = str(value).strip()

    if value == "":
        return None

    return value


def get_next_asset_code(category):
    prefix = category.code_prefix

    if not prefix:
        raise ValueError(
            f"Code prefix not set for category {category.name}"
        )

    assets = Asset.query.filter(
        Asset.category_id == category.id,
        Asset.asset_code.like(f"{prefix}_%")
    ).all()

    max_number = 0
    pattern = rf"^{prefix}_(\d+)$"

    for asset in assets:
        if not asset.asset_code:
            continue

        match = re.match(pattern, asset.asset_code)

        if match:
            number = int(match.group(1))
            max_number = max(max_number, number)

    return f"{prefix}_{max_number + 1:03d}"


with app.app_context():

    df = pd.read_excel(
        "import_data/assets.xlsx"
    )

    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    imported = 0
    skipped = 0

    asset_codes_seen = set()
    serial_numbers_seen = set()
    category_generated_count = {}

    for index, row in df.iterrows():

        category_name = clean(
            row.get("category")
        )

        if not category_name:
            print(
                f"Row {index + 2}: Skipped - Category missing"
            )
            skipped += 1
            continue

        category = Category.query.filter_by(
            name=category_name,
            is_active=True
        ).first()

        if not category:
            print(
                f"Row {index + 2}: Skipped - Category not found: {category_name}"
            )
            skipped += 1
            continue

        asset_code = clean(
            row.get("asset_code")
        )

        if asset_code:
            if asset_code in asset_codes_seen:
                print(
                    f"Row {index + 2}: Skipped - Duplicate asset code in Excel: {asset_code}"
                )
                skipped += 1
                continue

            existing_asset = Asset.query.filter_by(
                asset_code=asset_code
            ).first()

            if existing_asset:
                print(
                    f"Row {index + 2}: Skipped - Existing asset code in DB: {asset_code}"
                )
                skipped += 1
                continue

        serial_number = clean(
            row.get("serial_number")
        )

        if serial_number:
            if serial_number in serial_numbers_seen:
                print(
                    f"Row {index + 2}: Skipped - Duplicate serial in Excel: {serial_number}"
                )
                skipped += 1
                continue

            existing_serial = Asset.query.filter_by(
                serial_number=serial_number
            ).first()

            if existing_serial:
                print(
                    f"Row {index + 2}: Skipped - Existing serial in DB: {serial_number}"
                )
                skipped += 1
                continue

        vendor = None
        vendor_name = clean(
            row.get("vendor")
        )

        if vendor_name:
            vendor = Vendor.query.filter_by(
                name=vendor_name,
                is_active=True
            ).first()

            if not vendor:
                print(
                    f"Row {index + 2}: Warning - Vendor not found: {vendor_name}"
                )

        location = None
        location_name = clean(
            row.get("location")
        )

        if location_name:
            location = Location.query.filter_by(
                name=location_name,
                is_active=True
            ).first()

            if not location:
                print(
                    f"Row {index + 2}: Warning - Location not found: {location_name}"
                )

        employee = None
        employee_code = clean(
            row.get("employee_code")
        )

        if employee_code:
            employee = Employee.query.filter_by(
                employee_code=employee_code,
                is_active=True
            ).first()

            if not employee:
                print(
                    f"Row {index + 2}: Warning - Employee not found: {employee_code}"
                )

        purchase_date = None

        if not pd.isna(
            row.get("purchase_date")
        ):
            purchase_date = pd.to_datetime(
                row.get("purchase_date")
            ).date()

        warranty_expiry = None

        if not pd.isna(
            row.get("warranty_expiry")
        ):
            warranty_expiry = pd.to_datetime(
                row.get("warranty_expiry")
            ).date()

        purchase_cost = None

        if not pd.isna(
            row.get("purchase_cost")
        ):
            purchase_cost = float(
                row.get("purchase_cost")
            )

        asset_name = clean(
            row.get("asset_name")
        )

        if not asset_name:
            asset_name = "Unnamed Asset"

        if not asset_code:
            asset_code = get_next_asset_code(category)

        if asset_code in asset_codes_seen:
            print(
                f"Row {index + 2}: Skipped - Duplicate generated asset code: {asset_code}"
            )
            skipped += 1
            continue

        asset_codes_seen.add(
            asset_code
        )

        if serial_number:
            serial_numbers_seen.add(
                serial_number
            )

        status = (
            "Allocated"
            if employee
            else "Available"
        )

        asset = Asset(
            asset_code=asset_code,
            asset_name=asset_name,
            serial_number=serial_number,
            purchase_date=purchase_date,
            purchase_cost=purchase_cost,
            invoice_number=clean(
                row.get("invoice_number")
            ),
            warranty_expiry=warranty_expiry,
            status=status,
            purchase_condition=clean(
                row.get("purchase_condition")
            ) or "New",
            category_id=category.id,
            vendor_id=vendor.id
            if vendor
            else None,
            location_id=location.id
            if location
            else None,
            employee_id=employee.id
            if employee
            else None,
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