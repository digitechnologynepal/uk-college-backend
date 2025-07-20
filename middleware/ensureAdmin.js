const users = require("../model/userModel");
const ensureAdmin = async (req, res, next) => {
  const userDetail = await users.findById(req.user.id);
  if (userDetail && userDetail.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }
};

module.exports = ensureAdmin;
