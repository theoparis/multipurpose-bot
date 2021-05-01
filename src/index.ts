import { ShardingManager } from "discord.js";
import { config } from "./config";
import botClient from "./lib/botClient";

const client = new botClient();
const shards = new ShardingManager("./dist/bot.js", {
    token: config.token,
});

shards.on("shardCreate", (shard) =>
    client.logger.info("Sharding", `Successfully launched ${shard.id}`)
);

shards.spawn();
