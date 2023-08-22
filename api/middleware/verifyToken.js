import jwt from "jsonwebtoken";
import response from "../response.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return response(401, "unautorized", "unautorized", res);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return response(403, err, "forbidden", res);
    }
    req.email = decoded.email;
    next();
  });
};
