import {desc,eq} from "drizzle-orm";
import db from  "../drizzle/db"
import {User,NewUser,usersTable} from "../drizzle/schema"

//create a user
export const createUserServices = async(user:User): Promise<string | null> =>{
    const existingUser =await db.query.usersTable.findFirst({
        where: eq(usersTable.email,user.email),
    });

    if(existingUser){
        return null
    }

 await db.insert(usersTable).values (user).returning();
 return "User Created Successfully😎"
}

// //update User
// export const updateUserServices = async( userId: number, user:Partial<NewUser>):
// Promise<string>=>{
//     if(Object.keys(user).length ====== 0){
//         trhoe new Error ("No fields provided to update");
//     }
//     await
// }