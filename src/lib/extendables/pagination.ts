import { AkairoClient } from "discord-akairo";
import { User } from "discord.js";
import { MessageReaction } from "discord.js";
import { Message, MessageEmbed } from "discord.js";

export const paginationEmbed = async (
    client: AkairoClient,
    msg: Message,
    pages: MessageEmbed[],
    emojiList = ["⏪", "⏩"],
    timeout = 120000
) => {
    let footer = "";
    if (!msg || !msg.channel) throw new Error("Channel is inaccessible.");
    if (!pages) throw new Error("Pages are not given.");
    if (emojiList.length !== 2) throw new Error("Need two emojis.");
    let page = 0;
    footer += pages[page].footer?.text;
    const curPage = await msg.channel.send(
        pages[page].setFooter(`${footer} | Page ${page + 1} / ${pages.length}`)
    );
    for (const emoji of emojiList) await curPage.react(emoji);
    const reactionCollector = curPage.createReactionCollector(
        (reaction: MessageReaction, user: User) => {
            if (user.id !== msg.author.id) {
                reaction.users.remove(user);
                return false;
            }
            return emojiList.includes(reaction.emoji.name) && !user.bot;
        },
        { time: timeout }
    );
    reactionCollector.on("collect", (reaction) => {
        reaction.users.remove(msg.author);
        switch (reaction.emoji.name) {
            case emojiList[0]:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case emojiList[1]:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            default:
                break;
        }
        curPage.edit(
            pages[page].setFooter(
                `${footer} | Page ${page + 1} / ${pages.length}`
            )
        );
    });
    reactionCollector.on("end", () => {
        if (!curPage.deleted) curPage.reactions.removeAll();
    });
    return curPage;
};
