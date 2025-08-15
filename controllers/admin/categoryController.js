const Category = require("../../model/categoryModel");

// Helper: Ensure a document exists for a tab
const ensureCategoryDoc = async (tab) => {
    let doc = await Category.findOne({ tab });
    if (!doc) {
        doc = await Category.create({ tab });
    }
    return doc;
};

// Get categories for a specific tab
const getCategories = async (req, res) => {
    try {
        const { tab } = req.params; // tab = "gallery" or "newsEvents"
        const includeDeleted = req.query.includeDeleted === "true";

        const categoryDoc = await ensureCategoryDoc(tab);
        const categories = includeDeleted
            ? categoryDoc.categories
            : categoryDoc.categories.filter(c => !c.isDeleted);

        res.status(200).json({
            success: true,
            message: `Categories for ${tab} fetched`,
            data: categories
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addCategory = async (req, res) => {
    try {
        const { tab } = req.params;
        const { title } = req.body;

        if (!title) return res.status(400).json({ success: false, message: "Title required" });

        const categoryDoc = await ensureCategoryDoc(tab);
        categoryDoc.categories.push({ title: title.trim() });
        await categoryDoc.save();

        res.status(201).json({ success: true, message: "Category added", data: categoryDoc.categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { tab } = req.params;
        const { id, title } = req.body;

        if (!title) return res.status(400).json({ success: false, message: "Title required" });

        const categoryDoc = await ensureCategoryDoc(tab);
        const item = categoryDoc.categories.id(id);
        if (!item) return res.status(404).json({ success: false, message: "Category not found" });

        item.title = title.trim();
        await categoryDoc.save();

        res.status(200).json({ success: true, message: "Category updated", data: categoryDoc.categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const softDeleteCategory = async (req, res) => {
    try {
        const { tab } = req.params;
        const { id } = req.body;

        const categoryDoc = await ensureCategoryDoc(tab);
        const item = categoryDoc.categories.id(id);
        if (!item) return res.status(404).json({ success: false, message: "Category not found" });

        item.isDeleted = true;
        await categoryDoc.save();

        res.status(200).json({ success: true, message: "Category soft deleted", data: categoryDoc.categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCategories,
    addCategory,
    updateCategory,
    softDeleteCategory
};
