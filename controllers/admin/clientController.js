const Client = require("../../model/clientModel");
const { responseHandler } = require("../../helper/responseHandler");
const path = require("path");
const fs = require("fs");

// Create a new client
const createClient = async (req, res) => {
    try {
        const { name, website, number, location } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name || !image) {
            return responseHandler(res, 400, false, "Name and image are required", null);
        }

        const newClient = new Client({
            name,
            image,
            website,
            number,
            location,
        });

        await newClient.save();
        responseHandler(res, 201, true, "Client added successfully", newClient);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

// Get all clients
const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();
        responseHandler(res, 200, true, "Clients fetched successfully", clients);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

// Get a single client by ID
const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findById(id);
        if (!client) {
            return responseHandler(res, 404, false, "Client not found", null);
        }
        responseHandler(res, 200, true, "Client fetched successfully", client);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

// Update client
const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, website, number, location } = req.body;

        const existingClient = await Client.findById(id);
        if (!existingClient) {
            return responseHandler(res, 404, false, "Client not found", null);
        }

        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (website !== undefined) updateData.website = website;
        if (number !== undefined) updateData.number = number;
        if (location !== undefined) updateData.location = location;

        if (req.file) {
            const newImage = req.file.filename;
            updateData.image = newImage;

            if (req.file && existingClient.image) {
                const oldImagePath = path.join(__dirname, "../../uploads", existingClient.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        const updatedClient = await Client.findByIdAndUpdate(id, updateData, { new: true });
        responseHandler(res, 200, true, "Client updated successfully", updatedClient);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

// Delete client
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;

        const client = await Client.findById(id);
        if (!client) {
            return responseHandler(res, 404, false, "Client not found", null);
        }

        if (client.image) {
            const imagePath = path.join(__dirname, "../../uploads", client.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Client.findByIdAndDelete(id);
        responseHandler(res, 200, true, "Client deleted successfully", null);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient,
};
