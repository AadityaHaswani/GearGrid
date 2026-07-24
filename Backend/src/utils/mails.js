import { text } from "express";
import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendEmail = async(options)=>{
    const mainGenrator= new Mailgen({
        theme:"default",
        product:{
         name: "Task Manager",
         link:"https://taskmanagerlink.com"
        }
    })
    const emailTextual = mainGenrator.generatePlaintext(options.mailgenContent)
    const emailHtml = mainGenrator.generate(options.mailgenContent)

   const transporter= nodemailer.createTransport({

        host:process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user:process.env.MAILTRAP_SMTP_USER,
            pass:process.env.MAILTRAP_SMTP_PASS
        }

    })
    const mail = {
        from:"techiedude036@gmail.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    }
    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("Email Service Failed Silently");
        console.error("Error:",error);
        
        
        
    }
}


const emailVerificationMailgenContent = (username,verifcationUrl)=>{
    return {
        body:{
            name : username,
            intro: "Welcome To Our App ! We Are Excited To Have You On Board.",
            action:{
                instructions: "To Verify Your Mail Please Click On The Following Button.",
                button:{
                    color: "#3ebebc",
                    text: "Verify Your email",
                    link:verifcationUrl
                },


            },
            outro:"Need help, or have any question? Just reply to this mail, we'd love to help "
        }
    }
}


const passwordRestMailgenContent = (username,resetPasswordUrl)=>{
    return {
        body:{
            name : username,
            intro: "We got a request to reset the password of your account.",
            action:{
                instructions: "To reset Your password Please Click On The Following Button.",
                button:{
                    color: "#3ebebc",
                    text: "Reset Password ",
                    link:resetPasswordUrl
                },


            },
            outro:"Need help, or have any question? Just reply to this mail, we'd love to help "
        }
    }
}


export{
    emailVerificationMailgenContent,
    passwordRestMailgenContent,
    sendEmail
}