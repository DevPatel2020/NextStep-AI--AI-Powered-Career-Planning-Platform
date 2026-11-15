import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: string | null;
    /** Epoch ms of the last DB re-validation of this user. */
    checkedAt?: number;
    /** Set when the account was disabled/deleted after sign-in. */
    revoked?: boolean;
  }
}
