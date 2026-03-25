import { Queue } from "bullmq";
import dotenv from "dotenv";
dotenv.config();

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: {},  // ← required for Upstash
};


export const assignmentQueue = new Queue("assignment-generation", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,  // removes job from Redis after completion
    removeOnFail: true,      // removes failed jobs too
  },
});