import mongoose from "mongoose";

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to DB....");
    } catch (error) {
        console.log('Error while connecting', error.message);
    }
}

export default connection