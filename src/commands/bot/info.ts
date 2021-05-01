import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { config } from "../../config";

export default class InfoCommand extends Command {
    constructor() {
        super("status", {
            aliases: ["status", "stats", "info"],
            description:
                "Shows you information about this bot, such as statistics.",
        });
    }

    async exec(msg: Message) {
        const responseTime = Math.round(Date.now() - msg.createdTimestamp); // This will round the response time between when the message was received and when the message was sent
        const elapUsage = process.cpuUsage();

        const elapUserMS = elapUsage.user / 1000; // microseconds to milliseconds
        const elapSystMS = elapUsage.system / 1000;
        const cpuPercent = (
            (100 * (elapUserMS + elapSystMS)) /
            1000000
        ).toFixed(1);

        return msg.channel.send(
            new this.client.embed()
                .setTitle(`${config.botName} Status`)
                .setThumbnail(this.client.user?.avatarURL() ?? "")
                .addFields([
                    {
                        name: "Servers:",
                        inline: true,
                        value: `${this.client.guilds.cache.size}`,
                    },
                    {
                        name: "Shard Id:",
                        inline: true,
                        value: msg.guild?.shardID,
                    },
                    {
                        name: "Shard Ping:",
                        inline: true,
                        value: `${msg.guild?.shard.ping} ms`,
                    },

                    {
                        name: "Response Time:",
                        inline: true,
                        value: `${responseTime} ms`,
                    },
                    {
                        name: "Memory Usage:",
                        inline: true,
                        value: `${Math.round(
                            process.memoryUsage().heapUsed / 1000000
                        )} MB`,
                    },
                    {
                        name: "CPU Usage:",
                        inline: true,
                        value: `${cpuPercent}%`,
                    },
                ])
        );
    }
}
