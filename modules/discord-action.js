const database = require('../app').database;

class DiscordAction {
    constructor() {
    }

    /**
     * extract args of a discord command
     * @param command<string>
     * @returns {string[]}
     */
    static extractArgs(command) {
        command = command.split(' ');
        command.shift();
        return command;
    }

    static status(command = "", action, sender) {
        return new Promise((resolve, reject) => {
            database.findUserByID(sender).then((user) => {
                if (user.length === 1)
                    resolve(user[0].id + ' est assigné au joueur ' + user[0].pseudo);
                else
                    resolve(sender + ' n\'est pas assigné (voir commande relink)');
            }).catch(() => {
                reject('un problème est survenu');
            })
        })
    }

    static relink(command = "", action, sender) {
        const args = DiscordAction.extractArgs(command);
        return new Promise((resolve, reject) => {
            if (args.length !== action.args) {
                reject('Oops il semble que la commande ne soit pas complète (help pour avoir la liste des commandes)');
                return;
            }
            database.findUserByID(sender).then((user) => {
                if (user.length === 1) {
                    database.updateUser({pseudo: args[0], id: sender});
                    resolve('pseudo modifié pour ' + args[0]);
                } else {
                    database.insertUser({pseudo: args[0], id: sender});
                    resolve('pseudo modifié pour ' + args[0]);
                }
            }).catch((err) => {
                reject('Oops une erreur s\'est produite');
            })
        });
    }

    static help() {
        return new Promise((resolve, reject) => {
            let message = 'Hey, voici les commands disponibles pour VocalCraft\n';

            for (let action of discordActioner) {
                message += action.command + ': ' + action.description + '\n';
            }
            message += ':smiley:';
            resolve(message);
        })
    }
}

const discordActioner = [
    {
        command: 'relink', args: 1, action: DiscordAction.relink, description: 'permet de mettre à jour votre pseudo ' +
            'minecraft ex: relink VocalCraft'
    },
    {
        command: 'status', args: 0, action: DiscordAction.status,
        description: 'Montre les informations relatives à ton utilisateur'
    },
    {command: 'help', args: 0, action: DiscordAction.help, description: 'montre cette aide'}
];
module.exports = discordActioner;