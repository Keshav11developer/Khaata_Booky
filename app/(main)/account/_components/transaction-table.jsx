"use client";
import React, { useMemo, useState } from 'react'
import  useFetch from "@/hooks/use-fetch";

import { Table, TableCaption,TableHead,TableRow,TableBody,TableCell,TableHeader } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { defaultCategories } from '@/data/categories';
import { categoryColors } from '@/data/categories';
import { format } from 'date-fns';
import { Tooltip,TooltipContent,TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Clock, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext
} from "@/components/ui/pagination";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BarLoader } from 'react-spinners';
import  {bulkDeleteTransactions}  from '@/actions/accounts';


const TransactionTable = ({transactions}) => {

  const router = useRouter();
  const [selectedIds, setselectedIds] = useState([]);
  const [sortConfig, setsortConfig] = useState({
    field : "date",
    direction : "desc"
  })

    const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  //console.log(selectedIds);
  const filterAndSortedTrans = useMemo(()=>{
      let result = [...transactions]

      // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

      return result;
  },[
    transactions,
    searchTerm,
    typeFilter,
    recurringFilter,
    sortConfig,
  ]);

  const handleSort =(field) => {
    setsortConfig(current =>({
      field,
      direction :
      current.field== field  && current.direction== "asc" ? "desc" : "asc",
    }))
  };

  const handleSelect = (id) => {
       setselectedIds(current => current.includes(id) ? current.filter(item => item != id):[...current,id])  
    }

       

  const handleSelectAll = (id)=>{
     setselectedIds(current => 
      current.length===filterAndSortedTrans.length
      ? []
      :filterAndSortedTrans.map((t)=> t.id)
     );
  }

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
           if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return;

    deleteFn(selectedIds); 
  }
  const handleClearFilter = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setselectedIds([]);
  };
  /*const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedIds([]); // Clear selections on page change
  }; */
  const pageSize = 10;
  const totalPages = Math.ceil(filterAndSortedTrans.length/pageSize);
  const paginatedTrans = filterAndSortedTrans.slice( // (currentPage-1)*pageSize, currentPage*pageSize
    (currentPage-1)*pageSize, // start index
    currentPage*pageSize // end index (exclusive)
  )



  return (
    <div className='space-y-4'>
      {/*filters */}
          {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      )}

     <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(value) => {
              setRecurringFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>

           {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilter}
              title="Clear filters"
            >
              <X className="h-4 w-5" />
            </Button>
          )}

        </div>
      </div>


     {/*Transactions */}
       <div className='rounded-md border '>
      <Table>
        <TableHeader>
       <TableRow>
      <TableHead className="w-[50px]">
        <Checkbox
        onCheckedChange= {handleSelectAll}
        checked= {
          selectedIds.length===
          filterAndSortedTrans.length && filterAndSortedTrans.length>0
        }
        />
      </TableHead>
       <TableHead className="cursor-pointer"
       onClick= {() => handleSort('date')}>
        <div className='flex item-center'>Date{" "}
          {sortConfig.field ==="date" &&
          (sortConfig.direction==="asc" ? (
            <ChevronUp className='ml-1 h-4 w-4'/>
          ) : (
            <ChevronDown className='ml-1 h-4 w-4' />
          ))
          }
        </div>
      </TableHead>
      <TableHead>
        Description
      </TableHead>
      <TableHead className="cursor-pointer"
       onClick= {() => handleSort('category')}>
        <div className='flex item-center'>Category
          {sortConfig.field ==="category" &&
          (sortConfig.direction==="asc" ? (
            <ChevronUp className='ml-1 h-4 w-4'/>
          ) : (
            <ChevronDown className='ml-1 h-4 w-4' />
          ))
          }
        </div>
      </TableHead>
       <TableHead className="cursor-pointer"
       onClick= {() => handleSort('amount')}>
        <div className='flex item-center justify-end'>Amount 
          {sortConfig.field ==="amount" &&
          (sortConfig.direction==="asc" ? (
            <ChevronUp className='ml-1 h-4 w-4'/>
          ) : (
            <ChevronDown className='ml-1 h-4 w-4' />
          ))
          }
        </div>
      </TableHead>
      <TableHead>Recurring</TableHead>
      <TableHead className="w-[50px]"/>

    </TableRow>
  </TableHeader>
  <TableBody>
    {filterAndSortedTrans.length=== 0 ?(
      <TableRow>
        <TableCell
        colSpan={7}
        className="text-center text-muted-foreground ">
          No Transaction Found !!
        </TableCell>
      </TableRow>
    ) : (
      paginatedTrans.map((transaction) => (
        <TableRow key={transaction.id}>
              <TableCell>
                <Checkbox 
                onCheckedChange ={() =>handleSelect(transaction.id)}
                checked={selectedIds.includes(transaction.id)}
                />
              </TableCell>
              <TableCell>
                {format(new Date(transaction.date), "PP")}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className="capitalize">
                <span
                style={
                 {background :categoryColors[transaction.category]}
                }
                className='px-2 py-1 rounded text-white text-sm'>
                  {transaction.category}
                </span>
              </TableCell>
              <TableCell className= " text-right font-medium"
              style={{color : transaction.type === "EXPENSE" ? "red" : "green",}}
              >
                {transaction.type === "EXPENSE" ? '-' : '+'}
                ₹{transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                {transaction.isRecurring ? (
                        <Tooltip>
                            <TooltipTrigger>Hover</TooltipTrigger>
                              <TooltipContent>
                                <p>Add to library</p>
                              </TooltipContent>
                        </Tooltip>
                ):(
                  <Badge className= "gap-1" variant="outline">
                    <Clock className='h-3 w-3 '/>
                    One Time
                  </Badge>
                )}
              </TableCell>

              <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

        </TableRow>
      ))
    )}
    <TableRow></TableRow>
  </TableBody>
   </Table>


   {totalPages > 1 && (
  <Pagination className="mt-6 justify-center ">
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          aria-disabled={currentPage === 1}
        />
      </PaginationItem>

      {Array.from({ length: totalPages }, (_, i) => (
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i + 1}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      ))}

      <PaginationItem>
        <PaginationNext
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          aria-disabled={currentPage === totalPages}
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
)}

       </div>
    </div>
  )
}

export default TransactionTable