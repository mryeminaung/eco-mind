import { Request, Response } from "express";
import { UserRole } from "../types";
import { UserStore } from "../data/userStore";

const VALID_ROLES: UserRole[] = ["USER", "RECYCLER", "ADMIN"];

export async function listUsers(_req: Request, res: Response) {
  try {
    const users = await UserStore.list();
    res.json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    console.error("List users error:", error);
    res.status(500).json({ success: false, error: "Failed to list users" });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const user = await UserStore.getById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }
    const { password: _password, ...publicUser } = user;
    res.json({ success: true, data: publicUser });
  } catch (error: any) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch user" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { name, role, points } = req.body;
    const update: { name?: string; role?: UserRole; points?: number } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        res.status(400).json({ success: false, error: "Name cannot be empty" });
        return;
      }
      update.name = name.trim();
    }

    if (role !== undefined) {
      const normalized = String(role).toUpperCase() as UserRole;
      if (!VALID_ROLES.includes(normalized)) {
        res.status(400).json({ success: false, error: `Role must be one of: ${VALID_ROLES.join(", ")}` });
        return;
      }
      update.role = normalized;
    }

    if (points !== undefined) {
      const parsed = Number(points);
      if (!Number.isFinite(parsed) || parsed < 0) {
        res.status(400).json({ success: false, error: "Points must be a non-negative number" });
        return;
      }
      update.points = parsed;
    }

    const updated = await UserStore.update(req.params.id, update);
    if (!updated) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.json({ success: true, message: "User updated", data: updated });
  } catch (error: any) {
    console.error("Update user error:", error);
    res.status(500).json({ success: false, error: "Failed to update user" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    if (req.user && (req.user.id === req.params.id || req.user._id === req.params.id)) {
      res.status(400).json({ success: false, error: "You cannot delete your own account" });
      return;
    }

    const deleted = await UserStore.remove(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.json({ success: true, message: "User deleted" });
  } catch (error: any) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, error: "Failed to delete user" });
  }
}
