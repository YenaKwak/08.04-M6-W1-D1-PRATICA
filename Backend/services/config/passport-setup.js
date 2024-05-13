import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Author from "../models/author.model.js";
import jwt from "jsonwebtoken";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3002/api/auth/google/callback",
      scope: ["profile", "email"], // scope를 추가
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        let author = await Author.findOne({ googleId: profile.id });

        if (!author) {
          author = new Author({
            googleId: profile.id,
            username: profile.displayName,
            avatar: profile.photos[0].value,
          });
          await author.save();
        }

        const token = jwt.sign(
          { authorId: author._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        done(null, { author, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
