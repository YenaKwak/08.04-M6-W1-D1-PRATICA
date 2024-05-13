import jwt from "jsonwebtoken";
import Author from "../models/author.model.js";

export const generateJWT = (payload) => {
  //토큰생성하기
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
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
    const authHeader = req.headers.authorization;
    console.log("Received authorization header:", authHeader); // 로그 추가

    if (!authHeader) {
      return res.status(400).send("Login required");
    }

    const token = authHeader.replace("Bearer ", ""); // 공백 포함하여 제거
    const decoded = await verifyJWT(token);

    if (!decoded) {
      return res.status(401).send("Token is invalid");
    }

    const user = await Author.findById(decoded.authorId); // Author 모델 사용
    console.log("Authenticated user:", user); // 로그 추가

    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in authMiddleware:", err); // 오류 로그 추가
    return res.status(500).send("Internal Server Error");
  }
};
