import asyncHandler from "express-async-handler";
import { OAuth2Client } from "google-auth-library";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export const googleLogin =
  asyncHandler(async (req, res) => {
    const { credential } = req.body;

    const ticket =
      await client.verifyIdToken({
        idToken: credential,
        audience:
          process.env.GOOGLE_CLIENT_ID,
      });

    const payload = ticket.getPayload();

    const email = payload.email;

    const allowedEmails =
      process.env.ALLOWED_EMAILS.split(",");

    if (!allowedEmails.includes(email)) {
      res.status(401);

      throw new Error(
        "Unauthorized Email"
      );
    }

    let user = await User.findOne({
      email,
    });

    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user,
    });
  });