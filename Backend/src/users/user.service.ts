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

// --- LOCATION-BASED SERVICES ---

// Get Users By County
export const getUsersByCounty = async (county: string) => {
    return await db.query.usersTable.findMany({
        where: eq(usersTable.county, county),
        columns: { passwordHash: false },
        orderBy: [desc(usersTable.createdAt)],
    });
};

// Get Users By Constituency
export const getUsersByConstituency = async (constituency: string) => {
    return await db.query.usersTable.findMany({
        where: eq(usersTable.constituency, constituency),
        columns: { passwordHash: false },
        orderBy: [desc(usersTable.createdAt)],
    });
};

// Get Users By Ward
export const getUsersByWard = async (ward: string) => {
    return await db.query.usersTable.findMany({
        where: eq(usersTable.ward, ward),
        columns: { passwordHash: false },
        orderBy: [desc(usersTable.createdAt)],
    });
};

// Get Users By User Type
export const getUsersByUserType = async (userType: string) => {
    return await db.query.usersTable.findMany({
        where: eq(usersTable.userType, userType as any),
        columns: { passwordHash: false },
        orderBy: [desc(usersTable.createdAt)],
    });
};

// Get User Count By County
export const getUserCountByCounty = async () => {
    const users = await db.query.usersTable.findMany({
        columns: { county: true },
    });
    const counts: Record<string, number> = {};
    users.forEach(user => {
        if (user.county) {
            counts[user.county] = (counts[user.county] || 0) + 1;
        }
    });
    return counts;
};

// Get User Registration Stats By Month
export const getUserRegistrationStats = async (months: number = 12) => {
    const allUsers = await db.query.usersTable.findMany({
        columns: { createdAt: true },
    });
    const now = new Date();
    const stats: Record<string, number> = {};
    
    for (let i = 0; i < months; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        stats[key] = 0;
    }
    
    allUsers.forEach(user => {
        if (user.createdAt) {
            const date = new Date(user.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (stats[key] !== undefined) {
                stats[key]++;
            }
        }
    });
    
    return stats;
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