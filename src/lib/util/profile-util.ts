import { Profile } from "../../database/profile";
import { GuildUser } from "../../database/guild-user";
import { Guild } from "../../database/guild";
import {
    GuildMember,
    User,
    Guild as DiscordGuild,
    MessageEmbedOptions,
} from "discord.js";
import { AkairoClient } from "discord-akairo";

/**
 * Gets custom guild data from the discord.js guild id.
 */
export const getGuild = async (guildId: string) => {
    let existingGuild = await Guild.findOne({
        where: { guildId },
    });

    if (!existingGuild) {
        await Guild.insert({
            guildId,
            suggestionChannels: [],
            users: [],
        });

        existingGuild = await Guild.findOne({
            where: { guildId },
        });
    }
    return existingGuild;
};

export const getGuildUser = async (user: User, gm: GuildMember) => {
    let existingGuildUser = await GuildUser.findOne({
        userId: user.id,
    });

    if (!existingGuildUser) {
        await GuildUser.insert({
            userId: user.id,
            profiles: [],
            guild: await getGuild(gm.guild.id),
        });

        existingGuildUser = await GuildUser.findOne({
            userId: user.id,
        });
    }
    return existingGuildUser;
};

export const getProfile = async (user: User, gm: GuildMember) => {
    const gu = await getGuildUser(user, gm);

    let existingProfile = await Profile.findOne({
        where: { user: gu, main: true },
    });
    if (!existingProfile) {
        await Profile.insert({
            user: gu,
            main: true,
            fields: {
                Bio: "Hello world.",
            },
        });
        existingProfile = await Profile.findOne({
            where: { user: gu },
        });
    }
    return existingProfile;
};

export const fetchProfile = async (
    client: AkairoClient,
    user: User,
    gm: GuildMember
) => {
    const profileData = await getProfile(user, gm);

    let fields: [string, any][] = Object.entries(profileData!.fields);

    // Remove Duplicates
    fields = fields.filter(
        (field, index, self) =>
            index === self.findIndex((t) => t[0] === field[0])
    );
    return new client.embed()
        .setTitle(`${user.username}'s Profile`)
        .setThumbnail(user.avatarURL() || "")
        .addFields([
            {
                name: "Tag",
                value: `${user.tag}`,
                inline: true,
            },
            {
                name: "Account Created",
                inline: true,
                value: `${user.createdAt.toLocaleDateString()} at ${user.createdAt.toLocaleTimeString()}`,
            },
            {
                name: "Joined At",
                inline: true,
                value: `${gm.joinedAt?.toLocaleDateString()} at ${gm.joinedAt?.toLocaleTimeString()}`,
            },
            {
                name: `Usew ID`,
                inline: true,
                value: `${user.id}`,
            },
            {
                name: `User Status`,
                inline: true,
                value: `${user.presence.status}`,
            },
            ...fields.map((f) => ({
                name: f[0],
                value: f[1],
            })),
        ]);
};
