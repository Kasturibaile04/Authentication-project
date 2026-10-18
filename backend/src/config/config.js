import dotenv from 'dotenv';

dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment variables.")
}

if(!process.env.JWT_SECRETS){
    throw new Error("JWT_SECRETS is not defined in environment variables.")
}

const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRETS : process.env.JWT_SECRETS
}


export default config;