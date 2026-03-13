import type { Request, Response } from "express";
import { User, type IUser } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

type Role = "owner" | "staff";

interface RegisterBody {
  name?: string;
  email?: string;
  phone?: string;
  shopName?: string;
  password?: string;
  role?: Role;
}

interface LoginBody {
  email?: string;
  password?: string;
}

function safeUser(user: IUser) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    shopName: user.shopName,
    role: user.role,
    createdAt: user.createdAt
  };
}

export const registerUser = async (
  req: Request<unknown, unknown, RegisterBody>,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, shopName, password, role } = req.body ?? {};

    if (!name || !email || !phone || !shopName || !password) {
      res.status(400).json({
        message: "name, email, phone, shopName and password are required."
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      res.status(409).json({ message: "Email is already registered." });
      return;
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      shopName: shopName.trim(),
      password,
      role: role ?? "owner"
    });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      shopName: user.shopName
    });

    res.status(201).json({
      token,
      user: safeUser(user)
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (
  req: Request<unknown, unknown, LoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      res.status(400).json({ message: "email and password are required." });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      shopName: user.shopName
    });

    res.json({
      token,
      user: safeUser(user)
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user: safeUser(user) });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

