"use client";
import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '@/lib/schema';
import useFetch from '@/hooks/use-fetch';
import { createTransaction, updateTransaction } from '@/actions/transaction';
import { Select,SelectContent,SelectTrigger,SelectValue,SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CreateAccountDrawer } from '@/components/ui/create-account-drawer';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent,PopoverTrigger, } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from "lucide-react";
import { Switch } from '@/components/ui/switch';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import ReceiptScanner from "@/app/(main)/transaction/_components/receiptScanner"

const AddTransactionForm = ({accounts,categories, editMode= false,initialData= null}) => {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const {
   register,setValue,handleSubmit,formState:{errors},watch,getValues,reset
  } = useForm({
        resolver : zodResolver(transactionSchema),
        defaultValues:
        editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
    })

    const {
        loading :transactionLoading,
        fn : transactionFn,
        data : transactionresult
    } = useFetch(editMode ? updateTransaction : createTransaction);

    const type= watch("type");
    const isRecurring = watch("isRecurring");
    const date = watch("date");

     const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  const onSubmit = async (data) => {
      const formData = {
        ...data,
        amount : parseFloat(data.amount),
      };
     if(editMode){
         transactionFn(editId, formData);
      }else{
        transactionFn(formData);
      } 
    // transactionFn(formData)
  }

   useEffect(() => {
    if (transactionresult?.success && !transactionLoading) {
      toast.success(
         //"Transaction created successfully"
         editMode 
         ? "Transaction Updated Successfully"
         :  "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionresult.data.accountId}`);
    }
  }, [transactionresult?.success, transactionLoading, editMode]);

  const handleScanComplete= (scannedData) => {
      if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
    }
  };
  return (
    <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
        {/*Ai receipt scanner */}
       { !editMode && <ReceiptScanner onScanComplete={handleScanComplete}/>}

        <div>
            <label>Type</label>
            <Select onValueChange={(value)=> setValue("type",value)}
                defaultValues={type}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                </SelectContent>
            </Select>

            {errors.type &&(
                <p className='text-sm text-red-500'>{errors.type.message}</p>
            )}
        </div>

        {/*Amount and account */}
        <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Account</label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (₹{parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer> 
                <Button
                  variant="ghost"
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-sm text-red-500">{errors.accountId.message}</p>
          )}
        </div>
      </div>

      {/*category*/}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

       {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-4" align="start">
            <Calendar

              mode="single"
              selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              className="!w-full space-y-2" 
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2 ">
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

       {/* Recurring Toggle */}
      <div className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
        <div className="space-y-0.5">
          <label className="text-base font-medium">Recurring Transaction</label>
          <div className="text-sm text-muted-foreground">
            Set up a recurring schedule for this transaction
          </div>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
        />
      </div>

      {/* Recurring Interval */}
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Recurring Interval</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-sm text-red-500">
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

       {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-[350px]"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
         
          <Button type="submit" className="w-[350px]" disabled={transactionLoading}>
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>

    </form>
  )
}

export default AddTransactionForm


/*<Button type="submit" className="w-[350px]" disabled={transactionLoading}>
          Create Transaction
  </Button> */