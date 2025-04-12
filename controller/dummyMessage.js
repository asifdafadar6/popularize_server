const Message = require("../models/message");
const jwt = require("jsonwebtoken");


class dummyMessage{

    static getmessagebysenderId = async(req,res)=>{

        const reciverId = req.params.id;
        try{
            const authHeader = req.headers.authorization;
    
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
              return res.status(401).json({
                success: false,
                msg: "Please First Make login.",
              });
            }
      
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id; 

            const messages = await Message.find({
                $or: [
                    { senderId: userId, reciverId: reciverId },
                    { senderId: reciverId, reciverId: userId },
                  ],
            }).sort({ createdAt: 1 });

            res.status(200).json({ messages });

        }
        catch(err)
        {
            console.log(err);
            return res
              .status(500)
              .json({msg: `Something wrong is happened in the backend, Error in ${err.message}`}); 
        }
    };
 
    static sendMessage = async(req,res)=>{

        const reciverId = req.params.reciverid;
        const {text} = req.body;
        console.log(text);
        try {
          const authHeader = req.headers.authorization;
    
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
              success: false,
              msg: "Please First Make login.",
            });
          }
    
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decoded.id;  // which person give review
    
          const insert = await Message.create({
            reciverId,
            senderId:userId,
            text
          });

          return res.status(201).json({
            msg: "Message Send Successfully..",
            success: true,
            Message: insert,
          });
        } catch (err) {
          console.log(err);
          return res
            .status(500)
            .json({msg: `Something wrong is happened in the backend ${err.message}`});
        }
    }

    

}

module.exports = dummyMessage;


