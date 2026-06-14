import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = "eduasset-secret-key"

    SQLALCHEMY_DATABASE_URI = (
        f"sqlite:///{os.path.join(BASE_DIR, 'eduasset.db')}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = "eduasset-jwt-secret"

    UPLOAD_FOLDER = os.path.join(
        BASE_DIR,
        "app",
        "uploads"
    )
