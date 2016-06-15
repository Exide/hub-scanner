"use strict";

var HubClient = require('./lib/hubClient');
var URI = require('URIjs');
var channelURI = process.argv[2];
var keyword = process.argv[3];

var hubURI = URI(channelURI).authority();
var hubClient = new HubClient(hubURI);

// get latest item from channel
var uriPath = URI(channelURI).path();
var channelName = uriPath.substr(uriPath.lastIndexOf('/') + 1);
console.log('Scanning channel:', channelName);
hubClient.getItem(channelName, 'latest').then(function (item) {
    process.stdout.write('.');
    // console.log('Searching:', item.uri);
    searchForKeyword(item);
    goToPrevious(item);
}).catch(function (error) {
    console.log('\nERROR:', error);
});

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
        // console.log('Searching:', item.uri);
        searchForKeyword(previousItem);
        goToPrevious(previousItem)
    }).catch(function (error) {
        console.log('\nERROR:', error);
    });
}
