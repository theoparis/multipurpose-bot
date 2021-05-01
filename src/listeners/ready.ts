import { Listener } from "discord-akairo";

export default class ReadyEvent extends Listener {
    constructor() {
        super("ready", {
            emitter: "client",
            event: "ready",
        });
    }
    public async exec() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.client.logger.info("Bot", `Logged in: ${this.client.user!.tag}`);
    }
}
