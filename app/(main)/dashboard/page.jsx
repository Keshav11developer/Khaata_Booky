import {CreateAccountDrawer} from '@/components/ui/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { getUserAccounts } from '@/actions/dashboard'
import { getDashboardData } from '@/actions/dashboard'
import {AccountCard} from "./_components/account-card"
import React from 'react'
import { getCurrentBudget } from '@/actions/budget'
import BudgetProgress from "./_components/budget-progress"
import DashboardOverview from "./_components/transactionOverview"
import { getRecentTransactions } from '@/actions/accounts'

 async function  Dashboard() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAcc = accounts?.find((account)=> account.isDefault)

  let budgetData= null;
  if(defaultAcc){
      budgetData= await getCurrentBudget(defaultAcc.id)
  }

  //const transactions = await getRecentTransactions();
  //console.log(accounts);
  return (
    <div className='space-y-8'>
        {/*Budget progress */}
         {defaultAcc && (<BudgetProgress
          initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
         />)}
        {/*Overview */}
       <DashboardOverview
        accounts={accounts}
        transactions = {transactions || []}
        /> 
         {/*Account grid */}
         <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <CreateAccountDrawer>
                <Card className="hover :shadow duration-300 transform hover:-translate-y-1
                 transition-shadow cursor-pointer border-dashed hover:shadow-lg">
                    <CardContent className="flex flex-col items-center justify-center 
                    text-muted-foreground h-full pt-5">
                        <Plus className='h-10 w-10 mb-2'/>
                        <p className='text-sm font-medium'>Add New Account</p>
                    </CardContent>
                </Card>
            </CreateAccountDrawer>

            {accounts.length>0 && accounts ?.map((account)=>{
              return <AccountCard key={account.id} account={account}/>
            })}
         </div>
    </div>
  )
}

export default Dashboard