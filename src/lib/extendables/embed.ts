import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import { config } from "../../config";
export default class EmbedHandler extends MessageEmbed {
    constructor(data?: MessageEmbed | MessageEmbedOptions) {
        super(data);
        this.mainBotColor();
        this.setFooter("sex")
    }
    public mainBotColor() {
        this.setColor(config.botColor);
    }
    public warningColor() {
        this.setColor(config.warningColor);
    }
    public errorColor() {
        this.setColor(config.errorColor);
    }
    public successColor() {
        this.setColor(config.successColor);
    }
}
