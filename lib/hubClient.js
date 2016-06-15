(function () {

    "use strict";

    var Promise = require('bluebird');
    var URI = require('urijs');
    var superagent = require('superagent');

    module.exports = HubClient;

    function HubClient(hubURI) {
        console.log('Constructing HubClient:', hubURI);
        this.hubURI = hubURI;
    }

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
            .segment(item).toString();
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
