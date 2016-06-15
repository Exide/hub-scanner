(function () {

    "use strict";

    var Promise = require('bluebird');
    var URI = require('urijs');
    var superagent = require('superagent');
    var moment = require('moment');

    module.exports = HubClient;

    function HubClient(hubURI) {
        console.log('Constructing HubClient:', hubURI);
        this.hubURI = hubURI;
    }

    HubClient.prototype.getURIs = function (channel, date) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var uri = buildURIForDate(self.hubURI, channel, date);
            superagent.agent()
                .get(uri)
                .end(function (error, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(getURIs(response));
                    }
                });
        });
    }

    function buildURIForDate(host, channel, date) {
        var datetime = moment.utc(date, 'YYYY-MM-DD');
        return new URI()
            .protocol('http')
            .domain(host)
            .segment('channel')
            .segment(channel)
            .segment(String(datetime.year()))
            .segment(String(datetime.month()+1))
            .segment(String(datetime.date()))
            .segment('23')
            .segment('59')
            .toString()
    }

    function getURIs(response) {
        var json = JSON.parse(response.text);
        return json._links.uris;
    }

    HubClient.prototype.getItem

    HubClient.prototype.getItem = function (channel, item) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var uri = buildItemURI(self.hubURI, channel, item);
            superagent.agent()
                .get(uri)
                .end(function (error, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(constructItem(response));
                    }
                });
        });
    };

    function buildItemURI(host, channel, item) {
        return new URI()
            .protocol('http')
            .domain(host)
            .segment('channel')
            .segment(channel)
            .segment(item)
            .toString();
    }

    function constructItem(response) {
        return {
            id: parseItemID(response),
            uri: parseItemURI(response),
            links: parseLinks(response),
            headers: response.headers,
            content: response.body
        };
    }

    function parseItemID(response) {
        var uri = new URI(response.request.url);
        var path = uri.path();
        return path.substr(32);
    }

    function parseItemURI(response) {
        return response.request.url;
    }

    function parseLinks(response) {
        if (response.headers.link.length === 0) {
            throw new Error("input must not be of zero length");
        }

        // Split parts by comma
        var parts = response.headers.link.split(',');
        var links = {};
        // Parse each part into a named link
        for(var i=0; i<parts.length; i++) {
            var section = parts[i].split(';');
            if (section.length !== 2) {
                throw new Error("section could not be split on ';'");
            }
            var url = section[0].replace(/<(.*)>/, '$1').trim();
            var name = section[1].replace(/rel="(.*)"/, '$1').trim();
            links[name] = url;
        }
        return links;
    }

})();
