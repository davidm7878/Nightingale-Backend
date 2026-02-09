import express from "express";
const router = express.Router();
export default router;

import {
  createUser,
  getUserByUsernameAndPassword,
  getUserById,
  updateUserProfile,
} from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import getUserFromToken from "#middleware/getUserFromToken";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(requireBody(["email", "username", "password"]), async (req, res) => {
    const { email, username, password } = req.body;
    const user = await createUser(username, password, email);

    const token = await createToken({ id: user.id });
    res.status(201).send(token);
  });

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) return res.status(401).send("Invalid username or password.");

    const token = await createToken({ id: user.id });
    res.send(token);
  });

router.route("/me").get(getUserFromToken, async (req, res) => {
  const user = await getUserById(req.user.id);
  if (!user) return res.status(404).send("User not found");

  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

router.route("/profile").put(getUserFromToken, async (req, res) => {
  const { bio, resume } = req.body;
  const user = await updateUserProfile(req.user.id, bio, resume);
  if (!user) return res.status(404).send("User not found");

  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});
