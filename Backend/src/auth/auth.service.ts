// src/users/user.service.ts
import  db  from "../drizzle/db";
import { usersTable } from "../drizzle/schema";
import { eq, and, lt } from "drizzle-orm";
import { isNotNull} from "drizzle-orm";

// Types
export interface UserInsert {
  email: string;
  phone?: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  county?: string;
  userType?: 'mother' | 'health_worker' | 'admin' | 'policy_maker';
  isEmailVerified?: boolean;
  isActive?: boolean;
}

export interface UserSelect {
  id: number;
  email: string;
  phone: string | null;
  passwordHash: string;
  firstName: string | null;
  lastName: string | null;
  county: string | null;
  subCounty: string | null;
  village: string | null;
  userType: 'mother' | 'health_worker' | 'admin' | 'policy_maker';
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpires: Date | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Register user (updated)
export const registerUserService = async (user: UserInsert): Promise<{id: number}> => {
  const [newUser] = await db.insert(usersTable).values({
    email: user.email,
    phone: user.phone,
    passwordHash: user.passwordHash,
    firstName: user.firstName,
    lastName: user.lastName,
    county: user.county,
    userType: user.userType || 'mother',
    isEmailVerified: false, // Default to false for new users
  }).returning({ id: usersTable.id });

  return { id: newUser.id };
}

// Get user by email
export const getUserByEmailService = async (email: string): Promise<UserSelect | undefined> => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email)
  });
  return user as UserSelect | undefined;
}

// Get user by ID
export const getUserByIdService = async (id: number): Promise<UserSelect | undefined> => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, id)
  });
  return user as UserSelect | undefined;
}

// Update user password
export const updateUserPasswordService = async (email: string, newPasswordHash: string): Promise<string> => {
  const result = await db.update(usersTable)
    .set({ 
      passwordHash: newPasswordHash,
      updatedAt: new Date()
    })
    .where(eq(usersTable.email, email))
    .returning();

  if (result.length === 0) {
    throw new Error("User not found or password update failed");
  }
  
  return "Password updated successfully";
}

//  Set email verification token
export const setEmailVerificationTokenService = async (
  userId: number,
  token: string,
  expiresAt: Date
): Promise<void> => {
  await db.update(usersTable)
    .set({ 
      emailVerificationToken: token,
      emailVerificationExpires: expiresAt,
      updatedAt: new Date()
    })
    .where(eq(usersTable.id, userId));
}

//  Verify email with token
export const verifyEmailService = async (token: string): Promise<boolean> => {
  console.log("🔍 [DEBUG] Starting email verification...");
  console.log("🔍 [DEBUG] Token received:", token);
  console.log("🔍 [DEBUG] Token length:", token.length);

  try {
    // First, let's see if ANY user has this token
    const allUsersWithTokens = await db.select()
      .from(usersTable)
      .where(eq(usersTable.emailVerificationToken, token));

    console.log("🔍 [DEBUG] Users found with this token:", allUsersWithTokens.length);
    
    if (allUsersWithTokens.length > 0) {
      const user = allUsersWithTokens[0];
      console.log("🔍 [DEBUG] Found user:", user.email);
      console.log("🔍 [DEBUG] User isEmailVerified:", user.isEmailVerified);
      console.log("🔍 [DEBUG] Token expiry:", user.emailVerificationExpires);
      console.log("🔍 [DEBUG] Current time:", new Date());
      
      // Check if already verified
      if (user.isEmailVerified) {
        console.log("❌ [DEBUG] User already verified");
        return false;
      }
      
      // Check if token expired
      if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
        console.log("❌ [DEBUG] Token expired");
        return false;
      }
    } else {
      console.log("❌ [DEBUG] No user found with this token");
      // Let's check what tokens ARE in the database
      const allTokens = await db.select({
        email: usersTable.email,
        token: usersTable.emailVerificationToken
      })
      .from(usersTable)
      .where(isNotNull(usersTable.emailVerificationToken))
      
      console.log("🔍 [DEBUG] All tokens in DB:", allTokens);
      return false;
    }

    // Try to update the user
    const result = await db.update(usersTable)
      .set({ 
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date()
      })
      .where(eq(usersTable.emailVerificationToken, token))
      .returning({ id: usersTable.id });

    console.log("🔍 [DEBUG] Update result:", result.length > 0 ? "Success" : "Failed");
    
    return result.length > 0;

  } catch (error: any) {
    console.error("❌ [DEBUG] Error in verifyEmailService:", error.message);
    console.error("❌ [DEBUG] Full error:", error);
    return false;
  }
};

//  Set password reset token
export const setPasswordResetTokenService = async (
  email: string,
  token: string,
  expiresAt: Date
): Promise<boolean> => {
  const result = await db.update(usersTable)
    .set({ 
      passwordResetToken: token,
      passwordResetExpires: expiresAt,
      updatedAt: new Date()
    })
    .where(eq(usersTable.email, email))
    .returning({ id: usersTable.id });

  return result.length > 0;
}

// Reset password with token
export const resetPasswordWithTokenService = async (
  token: string,
  newPasswordHash: string
): Promise<boolean> => {
  const [user] = await db.select()
    .from(usersTable)
    .where(
      and(
        eq(usersTable.passwordResetToken, token),
        lt(usersTable.passwordResetExpires, new Date()) // Token not expired
      )
    )
    .limit(1);

  if (!user) {
    return false;
  }

  await db.update(usersTable)
    .set({ 
      passwordHash: newPasswordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      updatedAt: new Date()
    })
    .where(eq(usersTable.id, user.id));

  return true;
}

//  Check if email is verified
export const isEmailVerifiedService = async (email: string): Promise<boolean> => {
  const user = await getUserByEmailService(email);
  return user?.isEmailVerified || false;
}