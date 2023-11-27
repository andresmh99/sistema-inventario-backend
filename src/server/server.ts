import express from 'express';
import dotenv from "dotenv";


dotenv.config();

export default class Server{
    public app: express.Application;
    public port = process.env.PORT || 3000;

    constructor(){
        this.app = express();
    }

    Start(callback: Function ){
        this.app.listen(this.port, callback());
    }
}