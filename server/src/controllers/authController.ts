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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function requireCurrentPassword(userId: string, currentPassword: unknown) {
  if (!currentPassword || typeof currentPassword !== "string") {
    return { ok: false as const, status: 400, error: "Current password is required" };
  }
  const existing = await UserStore.getById(userId);
  if (!existing) {
    return { ok: false as const, status: 404, error: "Account not found" };
  }
  const match = await comparePassword(currentPassword, existing.password);
  if (!match) {
    return { ok: false as const, status: 401, error: "Current password is incorrect" };
  }
  return { ok: true as const, existing };
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: "Authentication required. Please log in." });
      return;
    }

    const { name, email, currentPassword } = req.body;
    const existing = await UserStore.getById(userId);
    if (!existing) {
      res.status(404).json({ success: false, error: "Account not found" });
      return;
    }

    const update: { name?: string; email?: string } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        res.status(400).json({ success: false, error: "Name cannot be empty" });
        return;
      }
      if (name.trim() !== existing.name) {
        update.name = name.trim();
      }
    }

    if (email !== undefined) {
      if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
        res.status(400).json({ success: false, error: "Enter a valid email address" });
        return;
      }
      const nextEmail = email.trim().toLowerCase();
      if (nextEmail !== existing.email) {
        const verified = await requireCurrentPassword(userId, currentPassword);
        if (!verified.ok) {
          res.status(verified.status).json({ success: false, error: verified.error });
          return;
        }
        update.email = nextEmail;
      }
    }

    if (Object.keys(update).length === 0) {
      res.json({ success: true, data: { user: toPublicUser(existing) } });
      return;
    }

    const updated = await UserStore.update(userId, update);
    if (!updated) {
      res.status(404).json({ success: false, error: "Account not found" });
      return;
    }

    const token = update.email
      ? signToken({ id: updated.id, email: updated.email, role: updated.role })
      : undefined;

    res.json({
      success: true,
      message: "Profile updated",
      data: { user: updated, token },
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    const message = error?.message || "Failed to update profile";
    const status = message.includes("already exists") ? 409 : 500;
    res.status(status).json({ success: false, error: message });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: "Authentication required. Please log in." });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      res.status(400).json({ success: false, error: "New password must be at least 6 characters" });
      return;
    }

    const verified = await requireCurrentPassword(userId, currentPassword);
    if (!verified.ok) {
      res.status(verified.status).json({ success: false, error: verified.error });
      return;
    }

    const updated = await UserStore.update(userId, { password: await hashPassword(newPassword) });
    if (!updated) {
      res.status(404).json({ success: false, error: "Account not found" });
      return;
    }

    res.json({ success: true, message: "Password updated", data: { user: updated } });
  } catch (error: any) {
    console.error("Change password error:", error);
    res.status(500).json({ success: false, error: "Failed to change password" });
  }
}
