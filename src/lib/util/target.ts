import { AkairoClient } from "discord-akairo";
import { User } from "discord.js";
import { Message, TextChannel } from "discord.js";
import { Channel } from "discord.js";

/**
 * Parses a discord.js user from a command argument (eg. a string containing a mention).
 * @param client The bot client
 * @param msg The message object from the command
 * @param arg The command argument to parse
 * @returns The parsed user object
 */
export const getTarget = (
    client: AkairoClient,
    msg: Message,
    arg: string
): User => {
    const target: User =
        arg && arg.length > 0
            ? client.users.cache.find(
                  (user) =>
                      user.username === arg.replace(/<@!?|>/g, "") ||
                      user.id === arg.replace(/<@!?|>/g, "") ||
                      user.tag === arg.replace(/<@!?|>/g, "")
              ) || msg.author
            : msg.author;
    return target;
};

export const isText = (channel: Channel): channel is TextChannel =>
    channel.type === "text";
