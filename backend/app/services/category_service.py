from app import db
from app.models.category_model import Category


class CategoryService:

    @staticmethod
    def create_category(
        name,
        description=None,
        code_prefix=None
    ):
        existing_category = Category.query.filter_by(
            name=name,
            is_active=True
        ).first()

        if existing_category:
            raise ValueError("Category already exists")

        category = Category(
            name=name,
            description=description,
            code_prefix=code_prefix
        )

        db.session.add(category)
        db.session.commit()

        return category
    
    @staticmethod
    def get_all_categories():
        """
        Return all active categories.
        """

        categories = Category.query.filter_by(
            is_active=True
        ).order_by(
            Category.name
        ).all()

        return categories
    
    @staticmethod
    def get_category_by_id(category_id):

        """
        Return a single category by ID.
        """

        category = Category.query.get(category_id)

        if not category:
            raise ValueError("Category not found")

        return category
    
    @staticmethod
    def update_category(
        category_id,
        name,
        description=None,
        code_prefix=None
    ):
        category = Category.query.get(category_id)

        if not category:
            raise ValueError("Category not found")

        category.name = name
        category.description = description
        category.code_prefix = code_prefix

        db.session.commit()

        return category

    @staticmethod
    def deactivate_category(category_id):
        category = Category.query.get(category_id)

        if not category:
            raise ValueError("Category not found")

        category.is_active = False

        db.session.commit()

        return category
    

    