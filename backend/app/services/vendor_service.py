from app import db
from app.models.vendor_model import Vendor


class VendorService:

    @staticmethod
    def create_vendor(
        name,
        contact_person=None,
        email=None,
        phone=None,
        address=None
    ):
        existing_vendor = Vendor.query.filter_by(
            name=name,
            is_active=True
        ).first()

        if existing_vendor:
            raise ValueError(
                "Vendor already exists"
            )

        vendor = Vendor(
            name=name,
            contact_person=contact_person,
            email=email,
            phone=phone,
            address=address
        )

        db.session.add(vendor)
        db.session.commit()

        return vendor

    @staticmethod
    def get_all_vendors():
        return Vendor.query.filter_by(
            is_active=True
        ).order_by(
            Vendor.name
        ).all()

    @staticmethod
    def get_vendor_by_id(vendor_id):
        vendor = Vendor.query.get(vendor_id)

        if not vendor:
            raise ValueError(
                "Vendor not found"
            )

        return vendor

    @staticmethod
    def update_vendor(
        vendor_id,
        name,
        contact_person=None,
        email=None,
        phone=None,
        address=None
    ):
        vendor = Vendor.query.get(vendor_id)

        if not vendor:
            raise ValueError(
                "Vendor not found"
            )

        duplicate = Vendor.query.filter(
            Vendor.name == name,
            Vendor.id != vendor_id
        ).first()

        if duplicate:
            raise ValueError(
                "Vendor already exists"
            )

        vendor.name = name
        vendor.contact_person = contact_person
        vendor.email = email
        vendor.phone = phone
        vendor.address = address

        db.session.commit()

        return vendor

    @staticmethod
    def deactivate_vendor(vendor_id):
        vendor = Vendor.query.get(vendor_id)

        if not vendor:
            raise ValueError(
                "Vendor not found"
            )

        vendor.is_active = False

        db.session.commit()

        return vendor