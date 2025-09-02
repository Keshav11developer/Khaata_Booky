import { inngest } from "./client";
import { db } from "../prisma";
import { sendEmail } from "@/actions/sendEmail";
import EmailTemplate from "@/emails/template"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { renderAsync } from "@react-email/render";

//export const checkBudgetAlert = inngest.createFunction(
 // { name : "Check Budget Alerts" },
//  {cron :"0 */6 * * *"}, 
/*  async ({  step }) => {
    const budgets = await step.run("fetch-budget", async () => {
        return await db.budget.findMany({
            include : {
                user : {
                    include : {
                        accounts : {
                            where : {
                                isDefault : true,
                            },
                        },
                    },
                },
            },
        });
    })
    for(const budget of budgets){
        const defaultAccount = budget.user.accounts[0];
        if(!defaultAccount) continue;

        await step.run(`check-budget-${budget.id}`, async () => {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        //startDate.setDate(1); // Start of current month

        // Calculate total expenses for the default account only
        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id, // Only consider default account
            type: "EXPENSE",
            date: {
              gte: startOfMonth,
              lte : endOfMonth
            },
          },
          _sum: {
            amount: true,
          },
        });

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = Number(budget.amount);
        const percentageUsed = (totalExpenses / budgetAmount) * 100;
        console.log(percentageUsed)

        // Check if we should send an alert
        if (
          percentageUsed >= 80 && // Default threshold of 80%
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), currentDate ))
        ) {
           // console.log(percentageUsed,budget.lastAlertSent)
           

          await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name}`,
            react: emailTemplate({
              userName: budget.user.name,
              type: "budget-alert",
              data: {
                percentageUsed,
                budgetAmount: parseInt(budgetAmount).toFixed(1),
                totalExpenses: parseInt(totalExpenses).toFixed(1),
                accountName: defaultAccount.name,
              },
            }),
          }); 

          // Update last alert sent
          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });
        }
      });
    }
  },
);   */

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}


export const checkBudgetAlert = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const results = [];

    const budgets = await step.run("fetch-budgets", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccount = budget.user?.accounts[0];
      if (!defaultAccount) continue;

      const currentDate = new Date();
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const expenses = await db.transaction.aggregate({
        where: {
          userId: budget.userId,
          accountId: defaultAccount.id,
          type: "EXPENSE",
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      });

      const totalExpenses = Number(expenses._sum.amount) || 0;
      const budgetAmount = Number(budget.amount);
      if (budgetAmount === 0) continue;

      const percentageUsed = (totalExpenses / budgetAmount) * 100;
      console.log(percentageUsed);

      results.push({
        user: budget.user.email,
        percentageUsed,
        percentageUsedFormatted: percentageUsed.toFixed(2),
        budgetAmount,
        totalExpenses,
      });

      if (
        percentageUsed >= 80 &&
        (!budget.lastAlertSent ||
          isNewMonth(new Date(budget.lastAlertSent), currentDate))
      ) {
        await sendEmail({
          to: budget.user.email,
          subject: `Budget Alert for ${defaultAccount.name}`,
          react: EmailTemplate({
            userName: budget.user.name,
            type: "budget-alert",
            data: {
              percentageUsed: percentageUsed.toFixed(1),
              budgetAmount: budgetAmount.toFixed(1),
              totalExpenses: totalExpenses.toFixed(1),
              accountName: defaultAccount.name,
            },
          }),
        });

        await db.budget.update({
          where: { id: budget.id },
          data: { lastAlertSent: new Date() },
        });
      }
    }

    return { status: "completed", results }; // ✅ Return summary
  }
);





export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
  },
  { cron: "0 0 1 * *" }, // First day of each month
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({
        include: { accounts: true },
      });
    });

    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStats(user.id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", {
          month: "long",
        });

        // Generate AI insights
        const insights = await generateFinancialInsights(stats, monthName);

       /* await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName}`,
          react: (
            <emailTemplate
              userName={user.name}
              type="monthly-report"
              data={{ month: monthName, stats, insights }}
            />
          ),
        }); */
        const html = await renderAsync(
          <EmailTemplate
            userName={user.name}
            type="monthly-report"
            data={{ month: monthName, stats, insights }}
          />
        );

        await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName}`,
          html,
        });
        return {
    userId: user.id,
    emailSent: true,
    stats,
    insights,
     };


        
      });
    }

    return { processed: users.length };
  }
);

async function getMonthlyStats(userId, month) {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
}

async function generateFinancialInsights(stats, month) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
   Analyze the following financial data and generate 3 concise, practical, and friendly insights. Your goal is to help the user understand their spending patterns and provide actionable advice for improvement or optimization.

Guidelines:

Be positive and encouraging, even when pointing out overspending.

Offer specific suggestions tied to the data (e.g., reduce spending in a high category, allocate surplus for savings or investments).

Highlight strengths and improvement areas.

Keep each insight short and conversational, like a personal finance coach speaking to the user.

Do NOT repeat raw numbers unless needed for context.

Format the response as a JSON array of strings, e.g.:
["insight 1", "insight 2", "insight 3"]

Financial Data for ${month}:

Total Income: $${stats.totalIncome}

Total Expenses: $${stats.totalExpenses}

Net Income: $${stats.totalIncome - stats.totalExpenses}

Expense Breakdown: ${Object.entries(stats.byCategory)
  .map(([category, amount]) => `${category}: $${amount}`)
  .join(", ")}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }
}