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
    app.register_blueprint(health_bp)

    from app.models.user_model import User
    from app.models.category_model import Category
    from app.models.vendor_model import Vendor
    from app.models.location_model import Location
    from app.models.employee_model import Employee
    from app.models.asset_model import Asset

    return app