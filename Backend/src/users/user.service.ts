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
export const updateUserService = async (
  userId: number,               // number type
  updatedData: Partial<User>
): Promise<string | null> => {

  // Check if user exists
  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });

  if (!existingUser) return null;

  // Update user
  await db.update(usersTable)
    .set(updatedData)
    .where(eq(usersTable.id, userId))
    .returning();

  return "User Updated Successfully 😎";
};

// Delete User
export const deleteUserService = async(userId:number):Promise<string | null> => {

  //check i fthe user exist
  const existingUser= await db.query.usersTable.findFirst({
    where: eq(usersTable.id,userId)
  });
 if(!existingUser) return null; //user not found

 //delete user
 await db.delete(usersTable).where(eq(usersTable.id,userId));
 return "User deleted successfully 😎"


}
;

//get user by id

export const userByIdService = async (userId:number) =>{

  //check if user exists:
  const existingUser= await db.query.usersTable.findFirst({
    where: eq(usersTable.id ,userId ),
    columns:{
      passwordHash:false
    }
  });
  if(!existingUser){
     return null;
  }

  //get user
return (existingUser)
}

//get all users

export const getAllUsersService = async () => {
  return await db.query.usersTable.findMany({
    columns: {
      passwordHash: false, // 🔐 hide passwords
    },
    orderBy: [desc(usersTable.createdAt)], // newest first
  });
};



