const Procedure = require("../../model/procedureModel");
const { responseHandler } = require("../../helper/responseHandler");

// CREATE a new procedure
const addProcedure = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return responseHandler(res, 400, false, "Title is required.");
        }

        const procedure = new Procedure({ title, description });
        await procedure.save();

        return responseHandler(res, 201, true, "Procedure added successfully.", procedure);
    } catch (err) {
        return responseHandler(res, 500, false, "Server error.", err);
    }
};

// GET all procedures
const getProcedures = async (req, res) => {
    try {
        const procedures = await Procedure.find().sort({ createdAt: -1 });
        return responseHandler(res, 200, true, "Procedures fetched successfully.", procedures);
    } catch (err) {
        return responseHandler(res, 500, false, "Server error.", err);
    }
};

// UPDATE a procedure
const updateProcedure = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const updated = await Procedure.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );

        if (!updated) {
            return responseHandler(res, 404, false, "Procedure not found.");
        }

        return responseHandler(res, 200, true, "Procedure updated successfully.", updated);
    } catch (err) {
        return responseHandler(res, 500, false, "Server error.", err);
    }
};

// DELETE a procedure
const deleteProcedure = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Procedure.findByIdAndDelete(id);

        if (!deleted) {
            return responseHandler(res, 404, false, "Procedure not found.");
        }

        return responseHandler(res, 200, true, "Procedure deleted successfully.");
    } catch (err) {
        return responseHandler(res, 500, false, "Server error.", err);
    }
};

module.exports = {
    addProcedure,
    getProcedures,
    updateProcedure,
    deleteProcedure,
}