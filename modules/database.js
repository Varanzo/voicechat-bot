const noSQL = require('nosql');

class Database {
    constructor() {
        this.db = noSQL.load('./storage/discord-user.nosql');
    }

    /**
     * return all user from database
     * @param filterQuery: {column<string>, comparator<string>, queryValue<any>}
     * @returns {Promise<any>}
     */
    getUserList(filterQuery = null) {
        return new Promise((resolve, reject) => {
            this.db.find().make((filter) => {
                if (filterQuery)
                    filter.where(filterQuery.column, filterQuery.comparator, filterQuery.queryValue);
                filter.callback((err, answer) => {
                    if (err)
                        reject(err);
                    else
                        resolve(answer);
                });
            });
        });
    }

    /**
     * find a user by his discord id
     * @param id<number> id to find
     * @returns {Promise<any[]>}
     */
    findUserByID(id) {
        return new Promise((resolve, reject) => {
            this.getUserList({column: 'id', comparator: '=', queryValue: id}).then(resolve).catch(reject);
        })
    }

    /**
     * find a user by his minecraft pseudo
     * @param pseudo<string> pseudo to find
     * @returns {Promise<any[]>}
     */
    findUserByName(pseudo) {
        return new Promise((resolve, reject) => {
            this.getUserList({column: 'pseudo', comparator: '=', queryValue: pseudo}).then(resolve).catch(reject);
        })
    }

    /**
     * insert a user in database
     * @param user<object> {pseudo<string>, id<string>}
     * @returns {boolean}
     */
    insertUser(user = null) {
        if (!user)
            return false;
        this.db.insert(user, true);
        return true;
    }

    updateUser(user) {
        this.db.modify({pseudo: user.pseudo}).where('id', user.id);
        return true;
    }
}

module.exports = Database;