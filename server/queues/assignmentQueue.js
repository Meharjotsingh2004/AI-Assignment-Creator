import { Queue } from "bullmq";
import dotenv from "dotenv";
dotenv.config();

const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

export const assignmentQueue = new Queue("assignment-generation", {
  connection,
});