const CourseApply = require('../../model/CourseApplyModel');
const { sendEmail } = require("../../utils/sendEmail");
const { responseHandler } = require("../../helper/responseHandler");


exports.createApplyCourse = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, testPrep } = req.body;
        console.log('Received data:', req.body);

        const application = new CourseApply({
            fullName,
            email,
            phoneNumber,
            testPrep,
        });

        await application.save();
        console.log('Application saved:', application);
        const emailOptions = {
            template: 'courseApplyReceived', 
            data: {
                fullName,
                email,
                phoneNumber,
                testPrep,
            },
            email: email,
            subject: 'Course Application Received',
        };
        await sendEmail(emailOptions);
        responseHandler(res, 201, true, 'Application submitted successfully!', null);
    } catch (error) {
        console.error('Error creating application:', error);
        responseHandler(res, 500, false, 'Internal server error', null);
    }

};

exports.getApplications = async (req, res) => {
    try {
        const applications = await CourseApply.find();
        if (applications.length > 0) {
            responseHandler(res, 200, true, "Applications retrieved successfully", applications);
        } else {
            responseHandler(res, 404, false, "No applications found", []);
        }
    } catch (error) {
        console.error("Error fetching applications:", error);
        responseHandler(res, 500, false, "Error fetching applications", null);
    }
};
