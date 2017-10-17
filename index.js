
const settings = require('./settings.json');

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.updateHost = function helloGET(req, res) {
    var token = req.query.token || req.body.token;
    var ip = req.query.ip || req.ip;
    var host = req.query.host || req.body.host;

    if (token != settings.secretToken) {
        respondWithError(401, 'unauthorized', 'Login Required', res)
        return;
    }

    if (!host) {
        respondWithError(400, 'missing host', 'Provide a valid host name', res)
        return;
    }

    if (!ip) {
        respondWithError(400, 'missing ip', 'Provide a valid IP address', res)
        return;
    }

    res.json({
        "zone": settings.dnsZone,
        "host": host,
        "ip": ip
    });
};

function respondWithError(status, title, detail, res) {
    let err = { 'errors': [{ 'status': status, 'title': title, "detail": detail }] };
    console.error(err);
    res.status(status).json(err);
}
