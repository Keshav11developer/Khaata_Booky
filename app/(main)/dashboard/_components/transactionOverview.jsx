"use client";
import React, { useState } from 'react'
import { Card,CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from '@/lib/utils';
import { PieChart,Pie,Cell,ResponsiveContainer,Tooltip,Legend, } from 'recharts';

const COLORS = [
  "#1E3A8A", // Deep Royal Blue
  "#9333EA", // Vibrant Purple
  "#BE123C", // Crimson Red
  "#0F766E", // Teal Green
  "#F59E0B", // Amber Gold
  "#047857", // Dark Emerald
  "#7F1D1D", // Dark Maroon
  "#4C1D95", // Indigo Purple
  "#9D174D", // Dark Magenta
  "#78350F", // Bronze Brown
  "#0369A1", // Ocean Blue
  "#581C87", // Deep Violet
  "#14532D", // Forest Green
  "#A16207", // Burnt Yellow
  "#450A0A"  // Blood Red
];


const DashboardOverview = ({accounts,transactions}) => {
    const [selectAccountId,setSelectAccountId] = useState(
        accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
    );


    const accountTransactions = (transactions || []).filter(
        (t) => t.accountId === selectAccountId
        
    )

    const recentTransaction = accountTransactions
    .sort((a,b) => new Date(b.date) - new Date(a.date))
    .slice(0,5);

     // Calculate expense breakdown for current month
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );


  return (
    <div className="grid gap-4 md:grid-cols-2">
        <Card className= "shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-normal">
            Recent Transactions
          </CardTitle>
          <Select
            value={selectAccountId}
            onValueChange={setSelectAccountId}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransaction.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No recent transactions
              </p>
            ) : (
              recentTransaction.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg p-3 
                  hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <div
                      className={cn(
                        "flex items-center",
                        transaction.type === "EXPENSE"
                          ? "text-red-500"
                          : "text-green-500"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      )}
                      ₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      { /* <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No expenses this month
            </p>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card> */}
      <Card className="shadow-lg rounded-xl">
  <CardHeader>
    <CardTitle className="text-base font-semibold text-center">
      Monthly Expense Breakdown
    </CardTitle>
  </CardHeader>
  <CardContent className="p-0 pb-5">
    {pieChartData.length === 0 ? (
      <p className="text-center text-muted-foreground py-4">
        No expenses this month
      </p>
    ) : (
      <div className="h-[320px] flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={1000}
              labelLine={false}
              label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Pie>

            {/* Tooltip */}
            <Tooltip
              formatter={(value) => `$${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                padding: "8px",
              }}
            />

            {/* Legend */}
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ paddingTop: 10 }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute text-center">
          <p className="text-sm text-muted-foreground pb-1">Total</p>
          <p className="text-lg font-bold pb-4">
            $
            {pieChartData
              .reduce((sum, entry) => sum + entry.value, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>
    )}
  </CardContent>
</Card>

    </div>
  )
}

export default DashboardOverview