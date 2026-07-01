const cron =require('node-cron');
const{subDays,startOfDay,endOfDay}=require("date-fns");
const ConnectionRequest=require("../models/connectionRequest")
const sendEmail=require("./sendEmail")
cron.schedule("31 14 * * *",async()=>{
    try{
        const yesterday=subDays(new Date(), 0);
        const yesterDayStart=startOfDay(yesterday);
        const yesterDayEnd=endOfDay(yesterday);
            const pendingRequest=await ConnectionRequest.find({
                status:'interested',
                createdAt:{
                    $gte:yesterDayStart,
                    $lt:yesterDayEnd,
                },
            }).populate("fromUserID toUserID");
            const listOfEmails=[...new Set(pendingRequest.map((req)=>req.toUserID.emailId))];
            console.log(listOfEmails);
            for(mail of listOfEmails){
                try{
                    const res=await sendEmail.run(
                        "New friend Request"+mail,
                        "You have received a connection request"
                    )
                    console.log(res)
                }catch(err){
                    console.log(err)    
                }
            }
        
    }catch(err){
        console.log(err)
    }
})