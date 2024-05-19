import ConversationModel from "../models/conversation.js"
import MessageModel from "../models/message.js"
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;

    const senderId = req.user._id;
    
    let conversation = await ConversationModel.findOne({
      participants : { $all : [senderId , receiverId] }
    })

    if(!conversation){
      conversation = await ConversationModel.create({participants : [senderId , receiverId]})
    }

    const newmessage =new MessageModel({
      senderId,
      receiverId,
      message
    })


    if(newmessage){
      conversation.messages.push(newmessage._id)
    }

    // await conversation.save();
    // await newmessage.save();

    // this will run im parrallel
    await Promise.all([ conversation.save() , newmessage.save() ])


    //socket io


    res.status(200).json(newmessage)

  } catch (error) {
    console.log(`error at sendMessage controller ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getMessage = async(req,res)=>{
  try {

      const {id : userToChatId} = req.params
      const senderId = req.user._id;
      
      const conversation = await ConversationModel.findOne({participants : {$all : [ senderId , userToChatId ] }}).populate("messages")


      if(!conversation) res.status(200).json( [] );

      const messages = conversation.messages

      res.status(200).json(messages)

    
  } catch (error) {
    console.log(`error at getMessage controller ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
}