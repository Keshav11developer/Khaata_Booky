"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { AccountType } from "@prisma/client";

const serializeTransaction = (obj) => {
    const serialized = {...obj};

    if(obj.balance){
        serialized.balance= obj.balance.toNumber();
    }
    
    if(obj.amount){
        serialized.amount= obj.amount.toNumber();
    }

    return serialized;

};

export async function createAccount(data){
    try{
        const {userId}= await auth();
        if(!userId) throw new Error("Unauthorized");


        const user = await db.user.findUnique({
            where : {clerkUserId : userId},
        });

        if(!user){
            throw new Error("User not found");
        }

       // convert balance to floating number before saving it
       const floatBalance = parseFloat(data.balance);
       if(isNaN(floatBalance)){
         throw new Error("Invalid balance amount")
       }

       //check if it is the user first account 
       const existingAcc = await db.account.findMany({
        where :{userId : user.id},
       });

       const shouldbeDefault = existingAcc.length===0 ? true : data.isDefault;

       //if this is the default account then unset all other default account 
       if(shouldbeDefault){
        await db.account.updateMany({
            where: {userId : user.id, isDefault: true},
            data : {isDefault:false}
        })
       }

       //new account 

       const account= await db.account.create({
            data : {
            ...data,
            type: AccountType[data.type], // ✅ enum-safe
            balance: floatBalance,
            userId : user.id,
            isDefault : shouldbeDefault,
           },
       })
       const serializedAcc = serializeTransaction(account);
       revalidatePath("/dashboard");
       return {success: true, data : serializedAcc};


    }catch(error){
        throw new Error(error.message)
    }
}

export async function getUserAccounts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    // Serialize accounts before sending to client
    const serializedAccounts = accounts.map(serializeTransaction);

    return serializedAccounts;
  } catch (error) {
    console.error(error.message);
  }
}


export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}