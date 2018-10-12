const Discord = require('discord.js');
const config = require('../environements/config');
const database = require('../app').database;
const discordActions = require('./discord-action');


class discordBot {
    constructor() {
        this.bot = new Discord.Client();
        this.logIn(config);
        this.guildID = config.guildID;
    }

    /**
     * try to connect discord bot to guild
     * @param config<object> {botKey<string>, guildID<string>, waitingAnswerTimeOut<number>}
     */
    logIn(config) {
        this.bot.login(config.botKey).then(() => {
            this.scanSignUpChannel();
            this.scanChannel();
        }).catch(err => {
            console.error(err);
            process.exit(1);
        });
        this.bot.on("ready", () => {
            console.info(`Bot has started, with ${this.bot.users.size} users, in ${this.bot.channels.size} channels of
             ${this.bot.guilds.size} guilds.`);
            this.bot.user.setActivity(`Serving ${this.bot.guilds.size} servers`);
        });
    }

    /**
     * extract member of discord user
     * @param userID<number>
     * @returns {Promise<GuildMember>}
     */
    getMember(userID) {
        return this.bot.guilds.get(this.guildID).fetchMember(userID);
    }

    /**
     * try to move userID to channelID
     * @param userID<string>
     * @param channelID<string>
     * @returns {Promise<any>}
     */
    moveMemberToChannel(userID, channelID) {
        return new Promise((resolve, reject) => {
            this.getMember(userID).then((member) => {
                member.setVoiceChannel(channelID).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    /**
     * Look for new member on guild and ask to link his discord account to minecraft
     */
    scanSignUpChannel() {
        this.bot.on('guildMemberAdd', (member) => {
            database.findUserByID(member.id).then((answer) => {
                if (answer.length === 1)
                    member.send('De retour  ' + member.displayName + '!\nVotre compte discord est lié au pseudo minecraft ' + answer[0].pseudo + '\nbon jeu\n:smiley:');
                else {
                    member.send('Bonjour ' + member.displayName + '.\nPour pouvoir profiter de VocalCraft, nous allons devoir' +
                        ' configurer ton compte.\nLa seul chose dont j\'ai besoin c\'est de ton pseudo minecraft.\n' +
                        'Réponds-le moi dans cette conversation!\n:smiley:').then((message) => {

                        const collector = new Discord.MessageCollector(message.channel, m => m.author.id !== message.author.id, {time: config.waitingAnswerTimeOut * 1000});
                        collector.on('collect', usernameMessage => {
                            collector.stop();
                            message.reply(usernameMessage.content + ' est votre pseudo enregistré.\nMerci et bon jeu\n:smiley:');
                            database.insertUser({id: usernameMessage.author.id, pseudo: usernameMessage.content});
                            console.info(usernameMessage.content + ' link to ' + usernameMessage.author.id);
                        });
                    });
                }
            });

        });
    }

    /**
     * Handle the bot cli
     */
    scanChannel() {
        this.bot.on('message', (message) => {
            if (message.channel.type === 'dm' && message.author.id !== this.bot.user.id) {
                for (const action of discordActions) {
                    if (message.content.indexOf(action.command) !== -1) {
                        action.action(message.content, action, message.author.id).then((result) => {
                            message.reply(result);
                        }).catch((err) => {
                            message.reply(err);
                            console.error(err);
                        });
                        break;
                    }
                }
            }
        });
    }
}

module.exports = discordBot;