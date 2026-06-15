from app import db
from app.models.location_model import Location


class LocationService:

    @staticmethod
    def create_location(name, description=None):
        existing_location = Location.query.filter_by(
            name=name
        ).first()

        if existing_location:
            raise ValueError(
                "Location already exists"
            )

        location = Location(
            name=name,
            description=description
        )

        db.session.add(location)
        db.session.commit()

        return location

    @staticmethod
    def get_all_locations():
        return Location.query.filter_by(
            is_active=True
        ).order_by(
            Location.name
        ).all()

    @staticmethod
    def get_location_by_id(location_id):
        location = Location.query.get(location_id)

        if not location:
            raise ValueError(
                "Location not found"
            )

        return location

    @staticmethod
    def update_location(
        location_id,
        name,
        description=None
    ):
        location = Location.query.get(
            location_id
        )

        if not location:
            raise ValueError(
                "Location not found"
            )

        duplicate = Location.query.filter(
            Location.name == name,
            Location.id != location_id
        ).first()

        if duplicate:
            raise ValueError(
                "Location already exists"
            )

        location.name = name
        location.description = description

        db.session.commit()

        return location

    @staticmethod
    def deactivate_location(location_id):
        location = Location.query.get(
            location_id
        )

        if not location:
            raise ValueError(
                "Location not found"
            )

        location.is_active = False

        db.session.commit()

        return location