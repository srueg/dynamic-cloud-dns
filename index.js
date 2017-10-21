/*jshint esversion: 6 */

const ipHelper = require('ip');
const DNS = require('@google-cloud/dns');
const settings = require('./settings.json');

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.updateHost = function helloGET(req, res) {
    var token = req.query.token || req.body.token;
    var ipv4 = req.query.ipv4 || req.body.ipv4;
    var ipv6 = req.query.ipv6 || req.body.ipv6;
    var host = req.query.host || req.body.host;

    if (token != settings.secretToken) {
        respondWithError(401, 'unauthorized', 'Login Required', res);
        return;
    }

    if (!host) {
        respondWithError(400, 'missing host', 'Provide a valid host name', res);
        return;
    }

    if (!ipv4 && !ipv6) {
        var ipAddr = req.ip;
        if (ipHelper.isV4Format(ipAddr)) {
            ipv4 = ipAddr;
        } else if (ipHelper.isV6Format(ipAddr)) {
            ipv6 = ipAddr;
        } else {
            respondWithError(
                400,
                'missing ip',
                'Could not evaluate ip address. Please provide with request.',
                res
            );
            return;
        }
    }

    if (ipv4 && !ipHelper.isV4Format(ipv4)) {
        respondWithError(
            400,
            'illegal IPv4',
            'Could not parse IPv4 address: ' + ipv4,
            res
        );
        return;
    }

    if (ipv6 && !ipHelper.isV6Format(ipv6)) {
        respondWithError(
            400,
            'illegal IPv6',
            'Could not parse IPv6 address: ' + ipv6,
            res
        );
        return;
    }

    console.log({
        zone: settings.dnsZone,
        host: host,
        ipv4: ipv4,
        ipv6: ipv6
    });

    updateHosts(host, ipv4, ipv6)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err =>
            respondWithError(
                err.code || 500,
                err.title || 'API error',
                err.message,
                res
            )
        );
};

function respondWithError(status, title, detail, res) {
    let err = { code: status, title: title, detail: detail };
    console.error(err);
    res.status(status).json(err);
}

function updateHosts(host, ipv4, ipv6) {
    var dnsClient = DNS({
        projectId: settings.projectId
    });

    var zone = dnsClient.zone(settings.dnsZone);

    return updateRecords(zone, host, ipv4, ipv6).then(() => {
        return {
            code: '200',
            values: {
                host: host,
                ipv4: ipv4,
                ipv6: ipv6
            }
        };
    });
}

function getOldRecords(zone, host) {
    return zone
        .getRecords({ name: host, filterByTypes_: { A: true, AAAA: true } })
        .then(data => {
            var oldRecord = data[0];
            if (oldRecord.length < 1) {
                throw {
                    code: 400,
                    title: 'illegal host',
                    message: 'Host \'' + host + '\' not found.'
                };
            }
            return oldRecord;
        });
}

function updateRecords(zone, host, ipv4, ipv6) {
    return getOldRecords(zone, host).then(oldRecords => {
        let newRecords = [];
        if (ipv4) {
            newRecords.push(
                zone.record('A', {
                    name: host,
                    ttl: settings.ttl,
                    data: ipv4
                })
            );
        }
        if (ipv6) {
            newRecords.push(
                zone.record('AAAA', {
                    name: host,
                    ttl: settings.ttl,
                    data: ipv6
                })
            );
        }
        zone.createChange({
            add: newRecords,
            delete: oldRecords
        });
    });
}
