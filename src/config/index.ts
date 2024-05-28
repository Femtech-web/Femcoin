require("dotenv").config();
import { IConfig } from './config.interface';

const config: IConfig = {
  port: process.env.PORT,

}

export default config;