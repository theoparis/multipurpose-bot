import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { fetchProfile } from "../../lib/util/profile-util";
import { getTarget } from "../../lib/util/target";

export default class ProfileCommand extends Command {
    constructor() {
        super("profile", {
            aliases: ["profile"],
            description: "Retrieve a user's profile",
            args: [
                {
                    id: "target",
                    type: "string",
                },
            ],
        });
    }

    async exec(msg: Message, { target }: Args) {
        const u = getTarget(this.client, msg, target);
        const gm = msg.guild?.members.cache.get(u.id)!;
        return msg.channel.send(
            new MessageEmbed(await fetchProfile(this.client, u, gm))
        );
    }
}

type Args = {
    target: string;
};
