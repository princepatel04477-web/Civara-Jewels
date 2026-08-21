import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface AdminSessionData {
  userId?: number;
  email?: string;
  name?: string;
  isLoggedIn?: boolean;
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "civara_super_secret_session_key_must_be_at_least_32_characters_long_for_security",
  cookieName: "civara_admin",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, // 8 hours
  },
};

export async function getAdminSession() {
  const cookieStore = cookies();
  return getIronSession<AdminSessionData>(cookieStore, sessionOptions);
}
