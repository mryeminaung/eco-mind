import { Request, Response } from "express";
import { UserRole } from "../types";
import { UserStore } from "../data/userStore";
import { comparePassword, hashPassword, signToken, toPublicUser } from "../utils/auth";

const REGISTER_ROLES: UserRole[] = ["USER", "RECYCLER"];

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ success: false, error: "Name is required" });
      return;
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      res.status(400).json({ success: false, error: "Email is required" });
      return;
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
      return;
    }

    const requestedRole = typeof role === "string" ? (role.toUpperCase() as UserRole) : "USER";
    if (requestedRole !== "USER" && requestedRole !== "RECYCLER") {
      res.status(400).json({
        success: false,
        error: "Self-registration is limited to USER or RECYCLER. Admin accounts are assigned separately.",
      });
      return;
    }
    if (!REGISTER_ROLES.includes(requestedRole)) {
      res.status(400).json({ success: false, error: "Invalid role" });
      return;
    }

    const existing = await UserStore.getByEmail(email);
    if (existing) {
      res.status(409).json({ success: false, error: "An account with this email already exists" });
      return;
    }

    const user = await UserStore.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: await hashPassword(password),
      role: requestedRole,
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { token, user },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, error: error?.message || "Failed to register" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: "Email and password are required" });
      return;
    }

    const user = await UserStore.getByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, error: "Invalid email or password" });
      return;
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      res.status(401).json({ success: false, error: "Invalid email or password" });
      return;
    }

    const publicUser = toPublicUser(user);
    const token = signToken({ id: publicUser.id, email: publicUser.email, role: publicUser.role });

    res.json({
      success: true,
      message: "Logged in successfully",
      data: { token, user: publicUser },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Failed to log in" });
  }
}

export async function me(req: Request, res: Response) {
  res.json({ success: true, data: req.user });
}
