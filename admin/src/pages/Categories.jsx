import {
    useEffect,
    useState
} from "react";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../api/categoryApi.js";

const Categories = () => {

    const [categories, setCategories] =
        useState([]);

    const [categoryName, setCategoryName] =
        useState("");

    const [editingId, setEditingId] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================
    // GET CATEGORIES
    // =========================

    const fetchCategories = async () => {

        try {

            const data =
                await getCategories();

            console.log(
                "Categories:",
                data
            );

            setCategories(
                data.categories || []
            );

        } catch (error) {

            console.error(
                "Categories error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load categories"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchCategories();

    }, []);


    // =========================
    // ADD / UPDATE
    // =========================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        if (!categoryName.trim()) {

            setError(
                "Category name is required"
            );

            return;
        }

        try {

            if (editingId) {

                await updateCategory(
                    editingId,
                    {
                        name: categoryName
                    }
                );

                alert(
                    "Category updated successfully"
                );

            } else {

                await createCategory({
                    name: categoryName
                });

                alert(
                    "Category created successfully"
                );
            }

            setCategoryName("");
            setEditingId(null);
            setError("");

            fetchCategories();

        } catch (error) {

            console.error(
                "Category save error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to save category"
            );
        }
    };


    // =========================
    // EDIT
    // =========================

    const handleEdit = (
        category
    ) => {

        setCategoryName(
            category.name
        );

        setEditingId(
            category._id
        );

        setError("");
    };


    // =========================
    // DELETE
    // =========================

    const handleDelete = async (
        categoryId
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this category?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteCategory(
                categoryId
            );

            alert(
                "Category deleted successfully"
            );

            fetchCategories();

        } catch (error) {

            console.error(
                "Delete category error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete category"
            );
        }
    };


    // =========================
    // CANCEL EDIT
    // =========================

    const handleCancel = () => {

        setCategoryName("");
        setEditingId(null);
        setError("");
    };


    if (loading) {

        return (
            <h2>
                Loading categories...
            </h2>
        );
    }


    return (
        <div className="admin-dashboard">

            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <div className="dashboard-header">

                <h1>
                    Categories 📂
                </h1>

                <p>
                    Manage food categories
                </p>

            </div>


            {/* ========================= */}
            {/* ADD / EDIT FORM */}
            {/* ========================= */}

            <div className="category-form-card">

                <h2>
                    {editingId
                        ? "Edit Category"
                        : "Add Category"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        placeholder="Category name"
                        value={categoryName}
                        onChange={(event) =>
                            setCategoryName(
                                event.target.value
                            )
                        }
                    />

                    <button type="submit">
                        {editingId
                            ? "Update Category"
                            : "Add Category"}
                    </button>

                    {editingId && (

                        <button
                            type="button"
                            onClick={
                                handleCancel
                            }
                        >
                            Cancel
                        </button>

                    )}

                </form>

            </div>


            {/* ========================= */}
            {/* ERROR */}
            {/* ========================= */}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {/* ========================= */}
            {/* CATEGORY LIST */}
            {/* ========================= */}

            <div className="category-list">

                {categories.length === 0 ? (

                    <p>
                        No categories found.
                    </p>

                ) : (

                    categories.map(
                        (category) => (

                            <div
                                className="category-card"
                                key={category._id}
                            >

                                <div>

                                    <h3>
                                        {
                                            category.name
                                        }
                                    </h3>

                                    <p>
                                        ID:{" "}
                                        {
                                            category._id
                                        }
                                    </p>

                                </div>

                                <div className="category-actions">

                                    <button
                                        onClick={() =>
                                            handleEdit(
                                                category
                                            )
                                        }
                                    >
                                        ✏️ Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                category._id
                                            )
                                        }
                                    >
                                        🗑️ Delete
                                    </button>

                                </div>

                            </div>

                        )
                    )

                )}

            </div>

        </div>
    );
};

export default Categories;