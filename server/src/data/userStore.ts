import { User, PublicUser, UserRole } from "../types";
import { isDbConnected } from "../config/db";
import { UserModel } from "../models/User";
import { hashPasswordSync, toPublicUser } from "../utils/auth";
import { badgeAwardFromPoints } from "../utils/badgeAward";

const DEMO_PASSWORD_HASH = hashPasswordSync("password123");

function emailAliases(email: string): string[] {
  const aliases = [email];
  if (email.endsWith("@ecomind.mm")) {
    aliases.push(email.replace(/@ecomind\.mm$/, "@recycleconnect.mm"));
  }
  if (email.endsWith("@recycleconnect.mm")) {
    aliases.push(email.replace(/@recycleconnect\.mm$/, "@ecomind.mm"));
  }
  return aliases;
}

const demoUsers: User[] = [
  {
    id: "usr-maythiri",
    name: "May Thiri",
    email: "citizen@ecomind.mm",
    password: DEMO_PASSWORD_HASH,
    role: "USER",
    points: 405,
    badgeAward: badgeAwardFromPoints(405),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rec-1",
    name: "RecyGlo Myanmar",
    email: "recycler@ecomind.mm",
    password: DEMO_PASSWORD_HASH,
    role: "RECYCLER",
    points: 0,
    badgeAward: badgeAwardFromPoints(0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "admin-1",
    name: "Platform Admin",
    email: "admin@ecomind.mm",
    password: DEMO_PASSWORD_HASH,
    role: "ADMIN",
    points: 0,
    badgeAward: badgeAwardFromPoints(0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let inMemoryUsers: User[] = demoUsers.map((u) => ({ ...u }));
let dbSeeded = false;

function mapUser(doc: any): User {
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    id: obj._id ? obj._id.toString() : obj.id,
    _id: obj._id ? obj._id.toString() : obj._id,
    name: obj.name,
    email: obj.email,
    password: obj.password,
    role: obj.role,
    points: obj.points ?? 0,
    badgeAward: obj.badgeAward || badgeAwardFromPoints(obj.points ?? 0),
    createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : undefined,
    updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : undefined,
  };
}

async function seedDbUsers(): Promise<void> {
  if (!isDbConnected() || dbSeeded) return;
  try {
    const count = await (UserModel as any).countDocuments();
    if (count === 0) {
      await (UserModel as any).insertMany(
        demoUsers.map(({ id: _id, ...rest }) => rest)
      );
    }
    dbSeeded = true;
  } catch (err) {
    console.error("Failed to seed demo users:", err);
  }
}

export const UserStore = {
  async list(): Promise<PublicUser[]> {
    await seedDbUsers();
    if (isDbConnected()) {
      try {
        const docs = await (UserModel as any).find().sort({ createdAt: -1 });
        if (docs.length > 0) {
          return docs.map((d: any) => toPublicUser(mapUser(d)));
        }
      } catch (err) {
        console.error("MongoDB list users failed, using memory store", err);
      }
    }
    return inMemoryUsers.map((u) => toPublicUser(u));
  },

  async getById(id: string): Promise<User | null> {
    await seedDbUsers();
    if (isDbConnected()) {
      try {
        const doc = await (UserModel as any).findById(id).select("+password");
        if (doc) return mapUser(doc);
      } catch {
        // Fall through to memory
      }
    }
    return inMemoryUsers.find((u) => u.id === id || u._id === id) || null;
  },

  async getByEmail(email: string): Promise<User | null> {
    await seedDbUsers();
    const aliases = emailAliases(email.trim().toLowerCase());
    if (isDbConnected()) {
      try {
        const doc = await (UserModel as any).findOne({ email: { $in: aliases } }).select("+password");
        if (doc) return mapUser(doc);
      } catch {
        // Fall through to memory
      }
    }
    return inMemoryUsers.find((u) => aliases.includes(u.email)) || null;
  },

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<PublicUser> {
    await seedDbUsers();
    const now = new Date().toISOString();
    const payload = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      role: data.role || "USER",
      points: 0,
      badgeAward: badgeAwardFromPoints(0),
    };

    if (isDbConnected()) {
      try {
        const created = await (UserModel as any).create(payload);
        return toPublicUser(mapUser(created));
      } catch (err: any) {
        if (err?.code === 11000) {
          throw new Error("An account with this email already exists");
        }
        console.error("MongoDB create user failed, saved to memory", err);
      }
    }

    const newUser: User = {
      ...payload,
      id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    inMemoryUsers.unshift(newUser);
    return toPublicUser(newUser);
  },

  async update(
    id: string,
    update: Partial<Pick<User, "name" | "role" | "points" | "email" | "password" | "badgeAward">>
  ): Promise<PublicUser | null> {
    await seedDbUsers();
    if (update.points !== undefined) {
      update.badgeAward = badgeAwardFromPoints(update.points);
    }
    if (update.email) {
      const taken = await UserStore.getByEmail(update.email);
      if (taken && taken.id !== id && taken._id !== id) {
        throw new Error("An account with this email already exists");
      }
    }

    if (isDbConnected()) {
      try {
        const doc = await (UserModel as any).findByIdAndUpdate(id, update, {
          new: true,
          runValidators: true,
        });
        if (doc) return toPublicUser(mapUser(doc));
      } catch (err: any) {
        if (err?.code === 11000) {
          throw new Error("An account with this email already exists");
        }
        console.error("MongoDB update user failed, using memory store", err);
      }
    }

    const index = inMemoryUsers.findIndex((u) => u.id === id || u._id === id);
    if (index === -1) return null;
    inMemoryUsers[index] = {
      ...inMemoryUsers[index],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    return toPublicUser(inMemoryUsers[index]);
  },

  async incrementPoints(id: string, amount: number): Promise<PublicUser | null> {
    await seedDbUsers();
    if (isDbConnected()) {
      try {
        const doc = await (UserModel as any).findByIdAndUpdate(
          id,
          { $inc: { points: amount } },
          { new: true }
        );
        if (doc) {
          const nextBadge = badgeAwardFromPoints(doc.points ?? 0);
          if (doc.badgeAward !== nextBadge) {
            doc.badgeAward = nextBadge;
            await doc.save();
          }
          return toPublicUser(mapUser(doc));
        }
      } catch {
        // Fall through to memory
      }
    }

    const user = inMemoryUsers.find((u) => u.id === id || u._id === id);
    if (!user) return null;
    user.points += amount;
    user.badgeAward = badgeAwardFromPoints(user.points);
    user.updatedAt = new Date().toISOString();
    return toPublicUser(user);
  },

  async remove(id: string): Promise<boolean> {
    await seedDbUsers();
    if (isDbConnected()) {
      try {
        await (UserModel as any).findByIdAndDelete(id);
      } catch {
        // Fall through to memory
      }
    }
    const before = inMemoryUsers.length;
    inMemoryUsers = inMemoryUsers.filter((u) => u.id !== id && u._id !== id);
    return inMemoryUsers.length < before;
  },
};
