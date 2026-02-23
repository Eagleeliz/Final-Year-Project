import db from "../drizzle/db";
import { usersTable, User } from "../drizzle/schema";
import { eq, and, or, gt, desc, isNotNull } from "drizzle-orm";

// --- TYPES ---
export interface UserInsert extends Partial<User> {
    email: string;
    passwordHash: string;
}

// --- GENERAL CRUD SERVICES ---

// Create User (with conflict checking)
export const createUserServices = async (user: User): Promise<string | { conflict: "email" | "phone" }> => {
    const existingUser = await db.query.usersTable.findFirst({
        where: or(
            eq(usersTable.email, user.email),
            user.phone ? eq(usersTable.phone, user.phone) : undefined
        ),
    });

    if (existingUser) {
        if (existingUser.email === user.email) return { conflict: "email" };
        if (user.phone && existingUser.phone === user.phone) return { conflict: "phone" };
    }

    await db.insert(usersTable).values(user);
    return "User Created Successfully 😎";
};

// Get All Users (Sorted by newest first)
export const getAllUsersService = async (limitNum: number = 50) => {
    return await db.query.usersTable.findMany({
        columns: { passwordHash: false },
        orderBy: [desc(usersTable.createdAt)],
        limit: limitNum,
    });
};

// Get User By ID
export const getUserByIdService = async (id: number) => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.id, id),
    });
};

// Get User By Email
export const getUserByEmailService = async (email: string) => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
    });
};

// Update User
export const updateUserService = async (userId: number, updatedData: Partial<User>) => {
    const result = await db.update(usersTable)
        .set({ ...updatedData, updatedAt: new Date() })
        .where(eq(usersTable.id, userId))
        .returning();
    return result.length > 0 ? "User Updated Successfully 😎" : null;
};

// Delete User
export const deleteUserService = async (userId: number) => {
    const result = await db.delete(usersTable)
        .where(eq(usersTable.id, userId))
        .returning();
    return result.length > 0 ? "User deleted successfully 😎" : null;
};

// --- AUTH & SECURITY SERVICES ---

// Register User (Specialized for Auth flow)
export const registerUserService = async (user: UserInsert): Promise<{ id: number }> => {
    const [newUser] = await db.insert(usersTable).values({
        ...user,
        isEmailVerified: false,
        isActive: true,
    }).returning({ id: usersTable.id });
    return { id: newUser.id };
};

// Set Email Verification Token
export const setEmailVerificationTokenService = async (userId: number, token: string, expiresAt: Date) => {
    await db.update(usersTable)
        .set({ 
            emailVerificationToken: token, 
            emailVerificationExpires: expiresAt 
        })
        .where(eq(usersTable.id, userId));
};

// Verify Email
export const verifyEmailService = async (token: string): Promise<boolean> => {
    const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.emailVerificationToken, token),
    });

    if (!user || user.isEmailVerified) return false;
    if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) return false;

    const result = await db.update(usersTable)
        .set({ 
            isEmailVerified: true, 
            emailVerificationToken: null, 
            emailVerificationExpires: null 
        })
        .where(eq(usersTable.id, user.id))
        .returning();

    return result.length > 0;
};

// Set Password Reset Token
export const setPasswordResetTokenService = async (email: string, token: string, expiresAt: Date) => {
    const result = await db.update(usersTable)
        .set({ 
            passwordResetToken: token, 
            passwordResetExpires: expiresAt 
        })
        .where(eq(usersTable.email, email))
        .returning();
    return result.length > 0;
};

// Reset Password with Token
export const resetPasswordWithTokenService = async (token: string, newPasswordHash: string): Promise<boolean> => {
    const [user] = await db.select()
        .from(usersTable)
        .where(
            and(
                eq(usersTable.passwordResetToken, token),
                // 🔥 THE FIX: Changed 'lt' to 'gt'
                gt(usersTable.passwordResetExpires, new Date()) 
            )
        )
        .limit(1);

    if (!user) return false;

    await db.update(usersTable)
        .set({ 
            passwordHash: newPasswordHash, 
            passwordResetToken: null, 
            passwordResetExpires: null 
        })
        .where(eq(usersTable.id, user.id));

    return true;
};