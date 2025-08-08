const { responseHandler } = require("../../helper/responseHandler");
const institutionProfile = require("../../model/institutionProfileModel");
const fs = require("fs");
const path = require("path");

const updateInstitutionProfile = async (req, res) => {
    try {
        const { email, location, number, facebook, threadLink, whatsapp, insta, linkedin, locationForMap } = req.body;
        const brochureFile = req.files?.brochure?.[0];
        const certificateFile = req.files?.certificate?.[0];


        if (!email || !location || !number || !facebook || !whatsapp || !insta || !linkedin || !locationForMap) {
            return responseHandler(res, 400, false, 'All fields are required.');
        }

        const existingContent = await institutionProfile.findOne();

        if (existingContent) {
            existingContent.email = email;
            existingContent.location = location;
            existingContent.number = number;
            existingContent.facebook = facebook;
            existingContent.threadLink = threadLink;
            existingContent.whatsapp = whatsapp;
            existingContent.insta = insta;
            existingContent.linkedin = linkedin;
            existingContent.locationForMap = locationForMap;

            if (brochureFile) {
                if (existingContent.brochure) {
                    const oldPath = path.join(__dirname, "../../uploads", existingContent.brochure);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                existingContent.brochure = brochureFile.filename;
            }

            if (certificateFile) {
                if (existingContent.certificate) {
                    const oldPath = path.join(__dirname, "../../uploads", existingContent.certificate);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                existingContent.certificate = certificateFile.filename;
            }


            await existingContent.save();
            return responseHandler(res, 200, true, 'Institution Profile updated successfully.', existingContent);
        } else {
            const newContent = new institutionProfile({
                email,
                location,
                number,
                facebook,
                threadLink,
                whatsapp,
                insta,
                linkedin,
                locationForMap,
                brochure: brochureFile ? brochureFile.filename : null,
                certificate: certificateFile ? certificateFile.filename : null,
            });

            await newContent.save();
            return responseHandler(res, 200, true, 'Institution Profile created successfully.', newContent);
        }
    } catch (error) {
        console.log('Error in updateInstitutionProfile:', error);
        return responseHandler(res, 500, false, 'An error occurred while processing your request.');
    }
};

const getInstitutionProfile = async (req, res) => {
    try {
        const content = await institutionProfile.findOne();
        return responseHandler(res, 200, true, 'Institution Profile fetched successfully.', content);
    } catch (error) {
        console.log('Error in getInstitutionProfile:', error);
        return responseHandler(res, 500, false, 'An error occurred while processing your request.');
    }
};

module.exports = {
    updateInstitutionProfile,
    getInstitutionProfile
};
