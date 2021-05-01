import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { config } from "../config";
import { join } from "path";
import { Logger } from "@nedbot/logger";
import EmbedHandler from "./extendables/embed";
import { createConnection } from "typeorm";
import { Profile } from "../database/profile";
import { GuildUser } from "../database/guild-user";
import { Guild } from "../database/guild";

export default class BotClient extends AkairoClient {
    public commandHandler: CommandHandler;
    public listenerHandler: ListenerHandler;
    public embed = EmbedHandler;
    public logger = new Logger({
        timestamp: "MM-DD-YYYY | HH:mm:ss",
        logFileDirectory: "logs",
    });

    constructor() {
        super(
            {
                ownerID: config.owners,
            },
            {
                disableMentions: "none",
            }
        );
        this.commandHandler = new CommandHandler(this, {
            directory: join(process.cwd(), "dist", "commands"),
            prefix: config.prefix,
            blockBots: true,
        });
        this.listenerHandler = new ListenerHandler(this, {
            directory: join(process.cwd(), "dist", "listeners"),
        });
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
        });
        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }
    async start() {
        await createConnection({
            type: "postgres",
            url: config.database,
            entities: [Profile, GuildUser, Guild],
            synchronize: true,
        });
        this.logger.info("Database", "Connection to the databse succeeded");
        super.login(config.token);
    }
}

declare module "discord-akairo" {
    interface AkairoClient {
        logger: Logger;
        readonly embed: typeof EmbedHandler;
    }
}

declare module "discord.js" {
    interface MessageEmbed {
        setMainColour(): this;
        setSuccess(): this;
        setError(): this;
        setWarning(): this;
    }
}
