import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { config } from "../../config";
import { paginationEmbed } from "../../lib/extendables/pagination";

export default class TestCommand extends Command {
    constructor() {
        super("test", {
            aliases: ["test"],
            description:
                "Test",
        });
    }

    async exec(msg: Message) {
        const pages = [
            new this.client.embed().setDescription("Hi"),
            new this.client.embed().setDescription("Test 1"),
            new this.client.embed().setDescription("Test 2"),
            new this.client.embed().setDescription("Bye"),
        ];

        return paginationEmbed(this.client, msg, pages);
    }
}
