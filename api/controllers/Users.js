import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import response from "../response.js";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["name", "email", "createdAt", "updatedAt"],
    });
    if (!users.length)
      return response(404, "users not found", "not found", res);
    response(200, users, "successfully get users data", res);
  } catch (error) {
    console.log(error);
    response(500, error.message, "error", res);
  }
};

export const getMe = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return response(204, "content not found", "content not found", res);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
      attributes: ["name", "email", "createdAt", "updatedAt"],
    });
    if (!user[0])
      return response(204, "content not found", "content not found", res);
    response(200, user, "success", res);
  } catch (error) {
    console.log(error);
    response(500, error.message, "error", res);
  }
};

export const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!password || !confirmPassword)
    return response(400, "password cannot be null!", "error", res);
  if (password !== confirmPassword)
    return response(
      400,
      "password and confirm password not match!",
      "error",
      res
    );
  const salt = await bcrypt.genSalt();
  const hashPasword = await bcrypt.hash(password, salt);
  try {
    const users = await Users.create({
      name: name,
      email: email,
      password: hashPasword,
    });
    const data = {
      name: users.name,
      email: users.email,
      isCreated: users.uniqno,
    };
    response(200, data, "successfully registered", res);
  } catch (error) {
    console.log(error);
    response(500, error.errors[0].message, "error", res);
  }
};

export const login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return response(400, "wrong password", "error", res);
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20S",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    response(200, {token:accessToken}, "successfully login", res);
  } catch (error) {
    console.log(error)
    response(404, error.message, "error", res);
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return response(404, "content not found", "not found", res);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0])
    return response(404, "content not found", "not found", res);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return response(200, "successfully logout", "success", res);
};
