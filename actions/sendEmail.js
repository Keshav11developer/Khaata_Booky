import { Resend } from "resend";
import  EmailTemplate  from "@/emails/template";

export async function sendEmail(
    {to,subject,html}){
    const resend = new Resend(process.env.RESEND_API_KEY || "");

    try{
        const data = await resend.emails.send({
            from : "FinanceApp <onboarding@resend.dev>",
            to  ,
            subject,
            html,
        });
        console.log("Resend response:", data);
        return {success : true, data}
    }catch(error){
        console.log("Failed to send email :",error);
        //return {success : false, error};
         throw error;
    }
}