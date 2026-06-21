from datetime import datetime

from app import db
from app.models.asset_model import Asset
from app.models.employee_model import Employee
from app.models.asset_damage_model import AssetDamage


class AssetDamageService:

    @staticmethod
    def report_damage(
        asset_id,
        employee_id,
        damage_date,
        damage_description,
        repair_cost=None,
        remarks=None
    ):
        asset = Asset.query.get(asset_id)

        if not asset:
            raise ValueError("Asset not found")

        employee = None

        if employee_id:
            employee = Employee.query.get(employee_id)

            if not employee:
                raise ValueError("Employee not found")

        damage = AssetDamage(
            asset_id=asset_id,
            employee_id=employee_id,
            damage_date=datetime.strptime(
                damage_date,
                "%Y-%m-%d"
            ).date(),
            damage_description=damage_description,
            repair_cost=repair_cost,
            remarks=remarks,
            status="Open"
        )

        asset.status = "Damaged"

        db.session.add(damage)
        db.session.commit()

        return damage

    @staticmethod
    def mark_repaired(damage_id):
        damage = AssetDamage.query.get(damage_id)

        if not damage:
            raise ValueError("Damage record not found")

        damage.status = "Repaired"

        if damage.asset:
            damage.asset.status = "Available"

        db.session.commit()

        return damage

    @staticmethod
    def get_asset_damage_history(asset_id):
        return AssetDamage.query.filter_by(
            asset_id=asset_id
        ).order_by(
            AssetDamage.damage_date.desc()
        ).all()
    
    @staticmethod
    def get_all_damages():
        return AssetDamage.query.order_by(
            AssetDamage.damage_date.desc()
        ).all()