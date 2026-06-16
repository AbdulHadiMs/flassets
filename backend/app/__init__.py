from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)

    app.config.from_object("config.Config")

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from app.api.health_routes import health_bp
    from app.api.category_routes import category_bp
    from app.api.vendor_routes import vendor_bp
    from app.api.location_routes import location_bp
    from app.api.employee_routes import employee_bp
    from app.api.asset_routes import asset_bp
    from app.api.auth_routes import auth_bp
    from app.api.asset_allocation_routes import allocation_bp


    app.register_blueprint(health_bp)
    app.register_blueprint(category_bp, url_prefix="/api")
    app.register_blueprint(vendor_bp, url_prefix="/api")
    app.register_blueprint(location_bp, url_prefix="/api")
    app.register_blueprint(employee_bp, url_prefix="/api")
    app.register_blueprint(asset_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(allocation_bp, url_prefix="/api")

    from app.models.user_model import User
    from app.models.category_model import Category
    from app.models.vendor_model import Vendor
    from app.models.location_model import Location
    from app.models.employee_model import Employee
    from app.models.asset_model import Asset
    from app.models.asset_allocation_model import AssetAllocation

    return app