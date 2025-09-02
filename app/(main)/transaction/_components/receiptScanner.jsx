"use client";
import { scanReceipt } from '@/actions/transaction';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { Camera, Loader, Loader2 } from 'lucide-react';
import React, {useRef} from 'react'
import { toast } from 'sonner';
import { useEffect } from 'react';


const ReceiptScanner = ({onScanComplete}) => {
    const fileInputRef = useRef();

    const {
        loading :scanReceiptLoading,
        fn : scanReceiptfn,
        data : scannedData,

    }= useFetch(scanReceipt);

    const handleReceiptScan = async (file ) => {
        if(file.size >5 * 1024 * 1024){
           toast.error("Sorry file size should be less than 5MB");
           return;
        }
        await scanReceiptfn(file);
    }

    useEffect(() => {
       if(scannedData && !scanReceiptLoading){
        onScanComplete(scannedData)
        toast.success("Receipt scanned successfully!!")
       }
    },[scannedData,scanReceiptLoading])
  return (
    <div>
        <input 
        type='file' 
        ref={fileInputRef}
        className='hidden'
        accept='image/*'
        capture="environment"
        onChange={(e) => {
            const file = e.target.files?.[0];
            if(file) handleReceiptScan(file);
        }}
        />

        <Button
         className=" w-full h-12 rounded-xl text-white font-semibold tracking-wide
         bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500
         animate-gradient hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50
         focus:ring-4 focus:ring-pink-400 transition-all duration-300 ease-out
  "
         onClick={() => fileInputRef.current?.click()}
         disabled={scanReceiptLoading}
        >
           {
            scanReceiptLoading ? (
               <>
               <Loader2 className='mr-2 animate-spin'/>
               <span>Scanning Receipt.....</span>
               </>
            ) : (
               <>
               <Camera className='mr-2'/>
               <span>Scan Receipt with AI</span>
               </>
            )
           }
        </Button>
    </div>
  )
}

export default ReceiptScanner