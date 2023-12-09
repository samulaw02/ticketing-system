import express, { Application } from "express";
import Server from "./src/index";

const app: Application = express();
new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
}).on("error", (err: any) => {
    console.log(err.code === "EADDRINUSE" ? "Error: address already in use" : err);
});

export default server;
