import mongoose from "mongoose"

export function mongooseConnect(){
    const uri = process.env.MONGODB_URI ||'mongodb://localhost:27017/';
    if(mongoose.connection.readyState === 1){
        return mongoose.connection.asPromise();
    }
    else{
        return mongoose.connect(uri)
    }
}