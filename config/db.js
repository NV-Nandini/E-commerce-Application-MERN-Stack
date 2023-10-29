//this is used to connect to the database
import mongoose from "mongoose"
import dotenv from "dotenv";
import colors from "colors"
const connectDB=async()=>{
try {
    const conn=await mongoose.connect(process.env.mongo_URL);// this establishes a connection
    console.log(`Connected to  Mongodb database ${conn.connection.host}`.bgMagenta.white) //gives the host IP address i.e IP adress of the MongoDB server we are connected to 
} catch (error) {
    console.log(`error in mongoDB ${error}`.bgRed.white);
}
}

export default connectDB;