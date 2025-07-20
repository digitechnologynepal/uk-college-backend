const fs = require("fs");
const path = require("path");
const { responseHandler } = require("../../helper/responseHandler");
const Motto = require("../../model/mottoModel");

const addOrUpdateMottoContent = async (req, res) => {
  try {
    const { motoTitle, missionText, visionText } = req.body;

    const existingContent = await Motto.findOne();

    // Get new uploaded files if any
    const newMissionIcon = req.files?.missionIcon ? req.files.missionIcon[0].filename : null;
    const newVisionIcon = req.files?.visionIcon ? req.files.visionIcon[0].filename : null;

    // Determine which icon to use: new uploaded or existing
    const missionIcon = newMissionIcon || existingContent?.mission?.icon || null;
    const visionIcon = newVisionIcon || existingContent?.vision?.icon || null;

    // Validate fields
    if (!motoTitle || !missionText || !visionText) {
      return responseHandler(res, 400, false, "Title, mission, and vision text are required.");
    }

    if (!missionIcon) {
      return responseHandler(res, 400, false, "Mission icon is required.");
    }

    if (!visionIcon) {
      return responseHandler(res, 400, false, "Vision icon is required.");
    }


    if (existingContent) {
      // Update existing motto content
      existingContent.motoTitle = motoTitle;
      existingContent.mission = { text: missionText, icon: missionIcon };
      existingContent.vision = { text: visionText, icon: visionIcon };

      await existingContent.save();
      return responseHandler(res, 200, true, "Motto content updated successfully.", existingContent);
    } else {
      // Create new motto content
      const newContent = new Motto({
        motoTitle,
        mission: { text: missionText, icon: missionIcon },
        vision: { text: visionText, icon: visionIcon },
      });

      await newContent.save();
      return responseHandler(res, 200, true, "Motto content created successfully.", newContent);
    }
  } catch (error) {
    console.log("Error in addOrUpdateMottoContent:", error);
    return responseHandler(res, 500, false, "An error occurred while processing your request.");
  }
};


const getMottoContent = async (req, res) => {
  try {
    const content = await Motto.findOne();
    return responseHandler(res, 200, true, "Motto content fetched successfully.", content);
  } catch (error) {
    console.log("Error in getMottoContent:", error);
    return responseHandler(res, 500, false, "An error occurred while processing your request.");
  }
};

module.exports = {
  addOrUpdateMottoContent,
  getMottoContent,
};
