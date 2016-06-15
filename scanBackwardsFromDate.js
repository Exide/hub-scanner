"use strict";

var HubClient = require('./lib/hubClient');
var URI = require('URIjs');
var channelURI = process.argv[2];
var keyword = process.argv[3];
var timestamp = process.argv[4];

var hubURI = URI(channelURI).authority();
var hubClient = new HubClient(hubURI);
var uriPath = URI(channelURI).path();
var channelName = uriPath.substr(uriPath.lastIndexOf('/') + 1);

console.log('Scanning backward on channel:', channelName);
console.log('Starting at:', timestamp + 'T23:59:59.999Z');

hubClient.getURIs(channelName, timestamp).then(function (uris) {
    var uri = parseItemID(uris[uris.length - 1]);
    hubClient.getItem(channelName, uri).then(function (item) {
        process.stdout.write('.');
        searchForKeyword(item);
        goToPrevious(item);
    }).catch(function (error) {
        console.log('\nERROR:', error);
    });
});

function parseItemID(uri) {
    var uri = new URI(uri);
    var path = uri.path();
    return path.substr(32);
}

function searchForKeyword(item) {
    var content = JSON.stringify(item.content);
    if (content.indexOf(keyword) != -1) {
        console.log('\nMATCH FOUND:', item.uri);
    }
}

function goToPrevious(item) {
    var previousItemID = new URI(item.links.previous).path().substr(32);
    hubClient.getItem(channelName, previousItemID).then(function (previousItem) {
        process.stdout.write('.');
        searchForKeyword(previousItem);
        goToPrevious(previousItem)
    }).catch(function (error) {
        console.log('\nERROR:', error);
    });
}
