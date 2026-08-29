import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env");
dotenv.config({ path: envPath });
