"use server";

import { db } from "@/lib/prisma";
import { subDays } from "date-fns";

const ACCOUNT_ID = "3f1950d9-1b80-4600-8d1f-51287dadfef3";
const USER_ID = "316b7223-9af9-4fcd-a8a2-30d87d7e0ff7";

// More diverse categories and realistic ranges
const CATEGORIES = {
  INCOME: [
    { name: "salary", range: [5000, 12000] },
    { name: "freelance", range: [500, 3000] },
    { name: "rental-income", range: [1000, 5000] },
    { name: "investment-return", range: [200, 1000] },
    { name: "bonus", range: [500, 2500] },
    { name: "gift", range: [100, 1000] },
  ],
  EXPENSE: [
    { name: "groceries", range: [100, 600] },
    { name: "utilities", range: [50, 300] },
    { name: "subscriptions", range: [100, 500] },
    { name: "health", range: [200, 1500] },
    { name: "travel", range: [300, 2500] },
    { name: "dining", range: [50, 400] },
    { name: "entertainment", range: [100, 800] },
    { name: "electronics", range: [300, 3000] },
    { name: "education", range: [500, 2500] },
    { name: "rent", range: [2000, 10000] },
  ],
};

// Random status for realism
const STATUS = ["COMPLETED", "PENDING", "FAILED"];

// Random merchant or note list
const MERCHANTS = [
  "Amazon", "Flipkart", "Zomato", "Swiggy", "Netflix", "Apple Store", "Google Pay", "IRCTC", "PhonePe", "Spotify"
];

// Helpers
function getRandomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomCategory(type) {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

function getRandomStatus() {
  const index = Math.random() < 0.9 ? 0 : Math.floor(Math.random() * STATUS.length); // 90% Completed
  return STATUS[index];
}

function getRandomMerchant() {
  return MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
}

export async function seedTransactions() {
  try {
    const transactions = [];
    let totalBalance = 0;

    for (let i = 90; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < transactionsPerDay; j++) {
        const type = Math.random() < 0.45 ? "INCOME" : "EXPENSE";
        const { category, amount } = getRandomCategory(type);
        const status = getRandomStatus();
        const merchant = getRandomMerchant();

        const transaction = {
          id: crypto.randomUUID(),
          type,
          amount,
          description: `${type === "INCOME" ? "Credited from" : "Paid to"} ${merchant} - ${category}`,
          date,
          category,
          status,
          userId: USER_ID,
          accountId: ACCOUNT_ID,
          createdAt: date,
          updatedAt: date,
        };

        if (status === "COMPLETED") {
          totalBalance += type === "INCOME" ? amount : -amount;
        }

        transactions.push(transaction);
      }
    }

    // Save to DB
    await db.$transaction(async (tx) => {
      await tx.transaction.deleteMany({ where: { accountId: ACCOUNT_ID } });

      await tx.transaction.createMany({ data: transactions });

      await tx.account.update({
        where: { id: ACCOUNT_ID },
        data: { balance: totalBalance },
      });
    });

    return {
      success: true,
      message: `Seeded ${transactions.length} transactions successfully`,
    };
  } catch (error) {
    console.error("Seeding failed:", error);
    return { success: false, error: error.message };
  }
}
