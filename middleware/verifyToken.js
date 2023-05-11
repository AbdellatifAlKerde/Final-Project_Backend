import jwt from "jsonwebtoken";

export const verifyUserToken = (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) return res.json("You are not authenticated");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.json("Token is invalid");
    req.user = user;
    next();
  });
};

export const verifyAdminToken = (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return res.json("You are not authenticated");

  jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
    if (err) return res.json("Token is invalid");
    req.admin = admin;
    next();
  });
};
