const discordBot = require('../../app').discordBot;

/**
 * test if asked data is present
 * @param req<request>
 * @returns {boolean}
 */
function controlRequest(req) {
    return (req.body.userID && req.body.channelID)
}

/**
 * send a 500 answer
 * @param data<string>
 * @param res<respond>
 */
function respondError(data, res) {
    console.error(data);
    res.status(500);
    res.json(data);
    res.end();
}

/**
 * send a 200 naswer
 * @param data<string>
 * @param res<respond>
 */
function respondSuccess(data, res) {
    res.status(200);
    res.json(data);
    res.end();
}

module.exports = (req, res, next) => {
    if (controlRequest(req)) {
        discordBot.moveMemberToChannel(req.body.userID, req.body.channelID).then((answer) => {
            respondSuccess(answer, res);
        }).catch((err) => {
            respondError(err, res);
        });
    } else
        respondError('parameters missing: {userID: string, channelID: string}', res);
};