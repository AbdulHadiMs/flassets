from app import db
from app.models.employee_model import Employee


class EmployeeService:

    @staticmethod
    def create_employee(
        employee_code,
        full_name,
        email=None,
        phone=None,
        department=None,
        designation=None
    ):
        existing_code = Employee.query.filter_by(
            employee_code=employee_code
        ).first()

        if existing_code:
            raise ValueError(
                "Employee code already exists"
            )

        if email:
            existing_email = Employee.query.filter_by(
                email=email
            ).first()

            if existing_email:
                raise ValueError(
                    "Email already exists"
                )

        employee = Employee(
            employee_code=employee_code,
            full_name=full_name,
            email=email,
            phone=phone,
            department=department,
            designation=designation
        )

        db.session.add(employee)
        db.session.commit()

        return employee

    @staticmethod
    def get_all_employees():
        return Employee.query.filter_by(
            is_active=True
        ).order_by(
            Employee.full_name
        ).all()

    @staticmethod
    def get_employee_by_id(employee_id):
        employee = Employee.query.get(employee_id)

        if not employee:
            raise ValueError(
                "Employee not found"
            )

        return employee

    @staticmethod
    def update_employee(
        employee_id,
        employee_code,
        full_name,
        email=None,
        phone=None,
        department=None,
        designation=None
    ):
        employee = Employee.query.get(
            employee_id
        )

        if not employee:
            raise ValueError(
                "Employee not found"
            )

        duplicate_code = Employee.query.filter(
            Employee.employee_code == employee_code,
            Employee.id != employee_id
        ).first()

        if duplicate_code:
            raise ValueError(
                "Employee code already exists"
            )

        if email:
            duplicate_email = Employee.query.filter(
                Employee.email == email,
                Employee.id != employee_id
            ).first()

            if duplicate_email:
                raise ValueError(
                    "Email already exists"
                )

        employee.employee_code = employee_code
        employee.full_name = full_name
        employee.email = email
        employee.phone = phone
        employee.department = department
        employee.designation = designation

        db.session.commit()

        return employee

    @staticmethod
    def deactivate_employee(employee_id):
        employee = Employee.query.get(
            employee_id
        )

        if not employee:
            raise ValueError(
                "Employee not found"
            )

        employee.is_active = False

        db.session.commit()

        return employee