import { createHash, timingSafeEqual } from "crypto";

/**
 * Optional bootstrap admin configured purely through environment variables.
 * There are deliberately NO defaults: if either variable is missing the
 * bootstrap admin is disabled and only database admins (isAdmin = true) work.
 */
export function getEnvAdmin(env: NodeJS.ProcessEnv = process.env) {
  const email = env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = env.ADMIN_PASSWORD;
  if (!email || !password) return null;
  return { email, password };
}

function safeEqual(a: string, b: string): boolean {
  // Hash first so inputs are equal length and comparison time is constant.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function matchesEnvAdmin(
  email: string,
  password: string,
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const admin = getEnvAdmin(env);
  if (!admin) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), admin.email);
  const passwordOk = safeEqual(password, admin.password);
  return emailOk && passwordOk;
}
