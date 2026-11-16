import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import connectDB from "../config/db.js";
import User from "../models/User.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_CHARACTERS = 12;
const MAX_PASSWORD_BYTES = 72;

class InputError extends Error {}

function promptHidden(prompt) {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
    throw new InputError("Password input requires an interactive terminal.");
  }

  stdout.write(prompt);
  stdin.setEncoding("utf8");
  stdin.setRawMode(true);
  stdin.resume();

  return new Promise((resolve, reject) => {
    let value = "";

    const finish = (error) => {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write("\n");

      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    };

    const onData = (chunk) => {
      for (const character of chunk) {
        if (character === "\u0003") {
          finish(new InputError("Admin setup was cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u007f" || character === "\b") {
          value = [...value].slice(0, -1).join("");
        } else if (!/[\u0000-\u001f\u007f]/.test(character)) {
          value += character;
        }
      }
    };

    stdin.on("data", onData);
  });
}

async function main() {
  let exitCode = 0;
  let connected = false;
  const prompts = createInterface({ input: stdin, output: stdout });

  try {
    if (!stdin.isTTY || !stdout.isTTY) {
      throw new InputError("Run this command in an interactive terminal.");
    }

    dotenv.config();
    await connectDB();
    connected = true;

    if (await User.exists({ role: "admin" })) {
      throw new InputError("An admin account already exists; no account was created.");
    }

    const name = (await prompts.question("Admin name: ")).trim();
    const email = (await prompts.question("Admin email: ")).trim().toLowerCase();
    prompts.close();

    if (!name) {
      throw new InputError("Admin name cannot be empty.");
    }
    if (!EMAIL_PATTERN.test(email)) {
      throw new InputError("Enter a valid email address.");
    }
    if (await User.exists({ email })) {
      throw new InputError("An account with that email already exists.");
    }

    const password = await promptHidden("Admin password: ");
    const passwordConfirmation = await promptHidden("Confirm password: ");

    if (password !== passwordConfirmation) {
      throw new InputError("Passwords do not match.");
    }
    if (
      !password.trim() ||
      [...password].length < MIN_PASSWORD_CHARACTERS ||
      Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES
    ) {
      throw new InputError(
        "Password must be at least 12 characters and no more than 72 UTF-8 bytes.",
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
    await adminUser.save();

    console.log(`Admin account created for ${email}.`);
  } catch (error) {
    if (error instanceof InputError) {
      console.error(error.message);
    } else if (error?.code === 11000) {
      console.error("An account with that email already exists.");
    } else {
      console.error(
        "Admin creation failed. Check the backend configuration and database availability.",
      );
    }
    exitCode = 1;
  } finally {
    prompts.close();
    if (connected) {
      try {
        await mongoose.disconnect();
      } catch {
        console.error("Could not close the MongoDB connection.");
        exitCode = 1;
      }
    }
  }

  process.exitCode = exitCode;
}

await main();
