const Application = require("../../model/applicationModel");
const { sendEmail } = require("../../utils/sendEmail");
const { responseHandler } = require("../../helper/responseHandler");

exports.createApplication = async (req, res) => {
  try {
    const { name, email, mobileNumber, queries, country, university, message } = req.body;
    console.log('Received data:', req.body);  // Check the incoming data
  
    const application = new Application({
      name,
      email,
      mobileNumber,
      queries,
      country,
      university,
      message,
    });
  
    await application.save();
    console.log('Application saved:', application); 
  
    const populatedApplication = await Application.findById(application._id).populate('university');
  
    const emailOptions = {
      template: 'applicationReceived',
      data: {
        name,
        email,
        mobileNumber,
        query: queries,
        university: populatedApplication.university.uniName,
        message,
      },
      email: email,
      subject: 'Application Received Successfully',
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
    // Get all applications from the database
    const applications = await Application.find().populate("university");

    // Send the response using responseHandler
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
