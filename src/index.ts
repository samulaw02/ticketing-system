import express, { Application } from "express";
import cors from "cors";
import Routes from "./Routes/Index";
import connectDB from "./database";
import dotenv from "dotenv";

dotenv.config();

export default class Server {
    constructor(app: Application) {
        this.config(app);
        new Routes(app);
        this.connectDatabase();
    }

    private config(app: Application): void {
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
    }

    private async connectDatabase(): Promise<void> {
        try {
            const MONGODB_URI = process.env.MONGODB_URI as string;
            await connectDB(MONGODB_URI);
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
        }
    }
}
