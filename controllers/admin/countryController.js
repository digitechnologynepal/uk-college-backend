const fs = require("fs");
const path = require("path");
const Country = require("../../model/countryModel");
const { responseHandler } = require("../../helper/responseHandler");

const createCountry = async (req, res) => {
    try {
        const { name, description, country } = req.body;
        // const flag = req.files.flag[0].filename;
        const countryImage = req.files.countryImage[0].filename;

        if (!name || !countryImage || !country) {
            return responseHandler(res, 400, false, "All fields are required", null);
        }

        const newCountry = new Country({
            name,
            country,
            countryImage,
            description
        });

        await newCountry.save();
        responseHandler(res, 201, true, "Country created successfully", newCountry);
    } catch (error) {
        console.error("Error creating country:", error);
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

// const createCountry = async (req, res) => {
//     try {
//         const { name } = req.body;
//         const flag = req.files.flag[0].filename;
//         const countryImage = req.files.countryImage[0].filename;

//         if (!name || !countryImage || !flag) {
//             return responseHandler(res, 400, false, "All fields are required", null);
//         }

//         // const existingCountry = await Country.find({'name' : name})
//         // if(existingCountry)   return responseHandler(res, 400, false, "Country is already present", null);


//         let questions = req.body.questions;
//         if (typeof questions === "string") {
//             questions = JSON.parse(questions);
//         }
//         console.log("Raw questions from body:", JSON.stringify(questions, null, 2));


//         let parsedQuestions = [];
//         if (questions && Array.isArray(questions)) {
//             for (let i = 0; i < questions.length; i++) {
//                 const current = questions[i];
//                 let question = {
//                     question: current.question,
//                     type: current.type,
//                     answer: current.answer || "",
//                     subPoint: []
//                 };
//                 if (current.type === "structured" && current.subPoints) {
//                     console.log("Structured question index:", i);
//                     console.log("Raw subPoints data:", current.subPoints);
//                     const subPointsArray = Array.isArray(current.subPoints)
//                         ? current.subPoints
//                         : [current.subPoints];

//                     subPointsArray.forEach((sub) => {
//                         question.subPoint.push({
//                             subHeading: sub.subHeading,
//                             description: sub.description
//                         });
//                     });
//                 }
//                 parsedQuestions.push(question);
//             }
//         }
//         const newCountry = new Country({
//             name,
//             flag,
//             countryImage,
//             questions: parsedQuestions
//         });

//         await newCountry.save();
//         responseHandler(res, 201, true, "Country created successfully", newCountry);
//     } catch (error) {
//         console.error("Error creating country:", error);
//         responseHandler(res, 500, false, "Server error", error.message);
//     }
// };

//Get Country By ID

const getCountryByID = async (req, res) => {
    try {
        const { id } = req.params;
        const country = await Country.findById(id);
        if (!country) return responseHandler(res, 404, false, "Country not found", null);
        responseHandler(res, 200, true, "Country fetched successfully", country);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
}

// Get all active countries (where isDeleted is false)
const getAllCountries = async (req, res) => {
    try {
        const countries = await Country.find({ isDeleted: false });
        responseHandler(res, 200, true, "Countries fetched successfully", countries);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

// Update a country by ID
const updateCountry = async (req, res) => {
    try {
        const { id } = req.params;
        // const { name, description} = req.body;
        const { name, description, country } = req.body;

        const existingCountry = await Country.findById(id);
        if (!existingCountry) {
            return responseHandler(res, 404, false, "Country not found", null);
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        //
        if (country) updateData.country = country;

        // Handle file uploads (flag and countryImage)
        if (req.files) {
            // if (req.files.flag) {
            //     const newFlag = req.files.flag[0].filename;
            //     updateData.flag = newFlag;

            //     // Delete old flag file if it exists
            //     const oldFlagPath = path.join(__dirname, "../uploads", existingCountry.flag);
            //     if (fs.existsSync(oldFlagPath)) {
            //         fs.unlinkSync(oldFlagPath);
            //     }
            // }

            if (req.files.countryImage) {
                updateData.countryImage = req.files.countryImage[0].filename;
            }
        }

        const updatedCountry = await Country.findByIdAndUpdate(id, updateData, { new: true });

        responseHandler(res, 200, true, "Country updated successfully", updatedCountry);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

//Delete Country BY ID
const deleteCountryByID = async (req, res) => {
    try {
        const { id } = req.params;

        const country = await Country.findByIdAndDelete(id);
        if (!country) {
            return responseHandler(res, 404, false, "Country not found", null);
        }

        responseHandler(res, 200, true, "Country deleted successfully", null);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

// Soft delete a country (set isDeleted to true)
const softDeleteCountry = async (req, res) => {
    try {
        const { id } = req.params;

        const country = await Country.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!country) {
            return responseHandler(res, 404, false, "Country not found", null);
        }

        responseHandler(res, 200, true, "Country deleted successfully", null);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

module.exports = {
    createCountry,
    getAllCountries,
    updateCountry,
    deleteCountryByID,
    softDeleteCountry,
    getCountryByID
};