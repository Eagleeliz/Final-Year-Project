import db from "../drizzle/db";
import { usersTable, User } from "../drizzle/schema";
import { eq, and, or, gt, desc } from "drizzle-orm";

// TYPES
export interface UserInsert extends Partial<User> {
    email: string;
    passwordHash: string;
}

// GENERAL CRUD SERVICES

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

export const getAllUsersService = async (limitNum: number = 50) => {
    return await db.query.usersTable.findMany({
        columns: { passwordHash: false },
        orderBy: [desc(usersTable.createdAt)],
        limit: limitNum,
    });
};

export const getUserByIdService = async (id: number) => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.id, id),
    });
};

export const getUserByEmailService = async (email: string) => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
    });
};

export const updateUserService = async (userId: number, updatedData: Partial<User>) => {
    const result = await db.update(usersTable)
        .set({ ...updatedData, updatedAt: new Date() })
        .where(eq(usersTable.id, userId))
        .returning();
    return result.length > 0 ? "User Updated Successfully 😎" : null;
};

export const deleteUserService = async (userId: number) => {
    const result = await db.delete(usersTable)
        .where(eq(usersTable.id, userId))
        .returning();
    return result.length > 0 ? "User deleted successfully 😎" : null;
};

// AUTH AND SECURITY SERVICES

export const registerUserService = async (user: UserInsert): Promise<{ id: number }> => {
    const [newUser] = await db.insert(usersTable).values({
        ...user,
        isEmailVerified: false,
        isActive: true,
    }).returning({ id: usersTable.id });
    return { id: newUser.id };
};

// Used for OTP - stores token in emailVerificationToken field
export const setEmailVerificationTokenService = async (userId: number, token: string, expiresAt: Date) => {
    await db.update(usersTable)
        .set({
            emailVerificationToken: token,
            emailVerificationExpires: expiresAt,
            updatedAt: new Date()
        })
        .where(eq(usersTable.id, userId));
};

// verifyEmailService removed - replaced by OTP flow in auth.controller.ts

export const setPasswordResetTokenService = async (email: string, token: string, expiresAt: Date) => {
    const result = await db.update(usersTable)
        .set({
            passwordResetToken: token,
            passwordResetExpires: expiresAt,
            updatedAt: new Date()
        })
        .where(eq(usersTable.email, email))
        .returning();
    return result.length > 0;
};

export const resetPasswordWithTokenService = async (token: string, newPasswordHash: string): Promise<boolean> => {
    const [user] = await db.select()
        .from(usersTable)
        .where(
            and(
                eq(usersTable.passwordResetToken, token),
                gt(usersTable.passwordResetExpires, new Date())
            )
        )
        .limit(1);

    if (!user) return false;

    await db.update(usersTable)
        .set({
            passwordHash: newPasswordHash,
            passwordResetToken: null,
            passwordResetExpires: null,
            updatedAt: new Date()
        })
        .where(eq(usersTable.id, user.id));

    return true;
};