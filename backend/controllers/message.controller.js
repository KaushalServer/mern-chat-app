import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js"

export const sendMessage = async (req, res) => {
    try {
        console.log(req);
        const {message} = req.body
        const {id: recieverId} = req.params
        const senderId = req.user._id
        const conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, recieverId]
            }
        })

        if(!conversation){
            conversation = await Conversation.create(
                {participants: [senderId, recieverId]}
            )
        }

        const newMesssage = new Message({
            senderId,
            recieverId,
            message
        })

        if(newMesssage){
            conversation.messages.push(newMesssage._id)
        }

        // await conversation.save()
        // await newMesssage.save()

        await Promise.all([conversation.save(), newMesssage.save()])

        const receiverSocketId = getReceiverSocketId(recieverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMesssage)
        }



        res.status(201).json(newMesssage)

    } catch (error) {
        console.log("Error while sending message: ", error.message);
        res.status(500).json({
            error: "Internal Server Error"
        })
        
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id: recieverId} = req.params
        const senderId = req.user._id

        const conversation = await Conversation.findOne({
            participants:{
                $all: [senderId, recieverId]
            },
        }).populate('messages')

        if(!conversation) return res.status(200).json([])

        const messages = conversation.messages

        res.status(200).json(messages)


    } catch (error) {
        console.log("Error while sending message: ", error.message);
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
}