const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(400).json({ error: "Unauthorized access" });
  }
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { _id: userId } = user;
    req.userId = userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};
module.exports = requireAuth;
