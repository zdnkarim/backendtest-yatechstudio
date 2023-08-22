import Users from "../models/Users.js";
import jwt from "jsonwebtoken";
import response from "../response.js";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return response(401, "unauthorized", "unauthorized", res);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return response(403, "forbidden", "forbidden", res);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return 403, "forbidden", "forbidden", res;
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign(
          { userId, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15s",
          }
        );
        response(200, { token: accessToken }, "successfully get token", res);
      }
    );
  } catch (error) {
    console.log(error);
  }
};
