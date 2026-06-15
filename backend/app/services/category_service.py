from app import db
from app.models.category_model import Category


class CategoryService:

    @staticmethod
    def create_category(name, description=None):

        """
        Create a new category.
        """

        existing_category = Category.query.filter_by(
            name=name
        ).first()

        if existing_category:
            raise ValueError(
                "Category already exists"
            )

        category = Category(
            name=name,
            description=description
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
    def update_category(category_id, name, description=None):
        category = Category.query.get(category_id)

        if not category:
            raise ValueError("Category not found")

        duplicate = Category.query.filter(
            Category.name == name,
            Category.id != category_id
        ).first()

        if duplicate:
            raise ValueError("Category already exists")

        category.name = name
        category.description = description

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