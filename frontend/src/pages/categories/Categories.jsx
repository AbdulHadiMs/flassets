import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";


function Categories() {
    const [categories, setCategories] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [formData, setFormData] =
        useState({
            name: "",
        });

    useEffect(() => {
        fetchCategories();
    }, []);

    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const fetchCategories = async () => {
        try {
            const response =
                await api.get("/categories");

            setCategories(
                response.data.data
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleCreateCategory =
        async (e) => {
            e.preventDefault();

            try {
                await api.post(
                    "/categories",
                    formData
                );

                setShowModal(false);

                setFormData({
                    name: "",
                });

                fetchCategories();

                toast.success("Category created successfully");
            } catch (error) {
                console.error(error);

                toast.error(error.response?.data?.message || "Failed to create category");
            }
        };

    const filteredCategories =
        categories.filter(
            (category) =>
                category.name
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
        );

    const handleEditClick = (category) => {
        setIsEditMode(true);
        setSelectedCategoryId(category.id);
        setFormData({
            name: category.name,
        });
        setShowModal(true);
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/categories/${selectedCategoryId}`, formData);

            setShowModal(false);
            setIsEditMode(false);
            setSelectedCategoryId(null);
            setFormData({ name: "" });

            fetchCategories();

            toast.success("Category updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update category");
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await api.delete(`/categories/${categoryId}`);

            fetchCategories();

            toast.success("Category deleted successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete category");
        }
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Categories
                </h1>

                <div className="flex gap-3">

                    <Input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-64"
                    />

                    <Button
                        onClick={() => {
                            setIsEditMode(false);
                            setSelectedCategoryId(null);
                            setFormData({
                                name: "",
                            });
                            setShowModal(true);
                        }}
                        className="bg-blue-600 text-white"
                    >
                        Add Category
                    </Button>

                </div>

            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="text-left p-4">
                                Category Name
                            </th>

                            <th className="text-left p-4">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredCategories.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="2"
                                    className="text-center p-6 text-gray-500"
                                >
                                    No categories found
                                </td>
                            </tr>
                        ) : (
                            filteredCategories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="border-t"
                                >
                                    <td className="p-4">
                                        {category.name}
                                    </td>

                                    <td className="p-4">

                                        <button
                                            onClick={() => handleEditClick(category)}
                                            className="text-blue-600 hover:underline mr-3"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>

            <Modal
                isOpen={showModal}
                onClose={() =>
                    setShowModal(false)
                }
                title={isEditMode ? "Edit Category" : "Add Category"}
            >
                <form
                    onSubmit={
                        isEditMode
                            ? handleUpdateCategory
                            : handleCreateCategory
                    }
                >

                    <Input
                        type="text"
                        name="name"
                        placeholder="Category Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mb-4"
                        required
                    />

                    <div className="flex justify-end gap-3">

                        <Button
                            type="button"
                            onClick={() =>
                                setShowModal(false)
                            }
                            className="border"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="bg-blue-600 text-white"
                        >
                            {isEditMode
                                ? "Update"
                                : "Save"}
                        </Button>

                    </div>

                </form>
            </Modal>

        </MainLayout>
    );
}

export default Categories;