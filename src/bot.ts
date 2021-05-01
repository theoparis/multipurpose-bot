import { config } from "./config";
import botClient from "./lib/botClient";

const client = new botClient();

client.start();
