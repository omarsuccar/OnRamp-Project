const jwt = require("jsonwebtoken");
const Company = require("../models/CompanyModel");
const requireAuth = async (req, res, next) => {
  // verify Company is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(400).json({ error: "Unauthorized access" });
  }
  try {
    const { _id } = jwt.verify(token, process.env.SECRET2);

    const company = await Company.findById(_id);
    if (!company) {
      return res.status(404).json({ error: "User not found!" });
    }
    const { _id: companyId } = company;
    req.companyId = companyId;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};
module.exports = requireAuth;
