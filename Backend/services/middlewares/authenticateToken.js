import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const generateJWT = (payload) => {
  //토큰생성하기
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

//토큰의 유효성 확인
export const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.status(400).send("Login it");
    } else {
      const decoded = await verifyJWT(
        req.headers.authorization.replace("Bearer ", "")
      );

      if (decoded.exp) {
        delete decoded.iat;
        delete decoded.exp;

        const me = await User.findOne({
          ...decoded,
        });

        if (me) {
          req.user = me;
          next();
        } else {
          res.status(401).send("User not found");
        }
      } else {
        res.status(401).send("Log in again");
      }
    }
  } catch (err) {
    next(err);
  }
};
