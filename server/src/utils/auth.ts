import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "../types";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "recycleconnect-myanmar-mvp-secret";
const JWT_EXPIRES_IN = "7d";
const SALT_ROUNDS = 10;

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function hashPasswordSync(plain: string): string {
  return bcrypt.hashSync(plain, SALT_ROUNDS);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function toPublicUser<T extends { password?: string }>(user: T): Omit<T, "password"> {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}
