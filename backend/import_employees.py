import pandas as pd

from app import create_app, db
from app.models.employee_model import Employee


app = create_app()


with app.app_context():

    df = pd.read_excel("import_data/employees.xlsx")

    for _, row in df.iterrows():

        existing = Employee.query.filter_by(
            employee_code=str(row["employee_code"])
        ).first()

        if existing:
            print(f"Skipped existing: {row['employee_code']}")
            continue

        employee = Employee(
            employee_code=str(row["employee_code"]),
            full_name=str(row["full_name"]),
            email=str(row["email"]) if not pd.isna(row["email"]) else None,
            phone=str(row["phone"]) if not pd.isna(row["phone"]) else None,
            department=str(row["department"]) if not pd.isna(row["department"]) else None,
            designation=str(row["designation"]) if not pd.isna(row["designation"]) else None,
            is_active=True
        )

        db.session.add(employee)

    db.session.commit()

    print("Employees imported successfully")