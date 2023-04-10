// ==UserScript==
// @name         Most Visited Channels on Hover
// @description  Displays the most visited channels on a server when hovering over a server in the Discord channel list.
// @version      1
// @author       Toshi Honda
// @namespace    https://example.com
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define a variable to store the most visited channels for each server
    var mostVisitedChannels = {};

    // Track user behavior on a server by updating the most visited channels list
    function trackChannelUsage(serverId, channelId) {
        if (mostVisitedChannels[serverId]) {
            if (mostVisitedChannels[serverId][channelId]) {
                mostVisitedChannels[serverId][channelId]++;
            } else {
                mostVisitedChannels[serverId][channelId] = 1;
            }
        } else {
            mostVisitedChannels[serverId] = {};
            mostVisitedChannels[serverId][channelId] = 1;
        }
    }

    // Get the server ID and channel ID for a given element in the Discord channel list
    function getServerAndChannelId(elem) {
        var serverElem = elem.closest('.guild');
        var serverId = serverElem.attr('data-id');
        var channelElem = elem.closest('.channel');
        var channelId = channelElem.attr('data-channel-id');
        return [serverId, channelId];
    }

    // Display the most visited channels for a server when hovering over the server in the Discord channel list
    function displayMostVisitedChannels(serverId, elem) {
        var channels = mostVisitedChannels[serverId];
        if (!channels) return;
        var channelList = Object.entries(channels).sort(function(a, b) {
            return b[1] - a[1];
        }).slice(0, 5);
        var channelNames = channelList.map(function(channel) {
            return $('<div>').text(channel[0]);
        });
        var tooltip = $('<div>').addClass('tooltip').append(channelNames);
        elem.append(tooltip);
    }

    // Hook into the mouseenter event for server elements in the Discord channel list
    $('.guild').on('mouseenter', function() {
        var [serverId, channelId] = getServerAndChannelId($(this));
        trackChannelUsage(serverId, channelId);
        displayMostVisitedChannels(serverId, $(this));
    });

    // Hook into the mouseleave event for server elements in the Discord channel list
    $('.guild').on('mouseleave', function() {
        $(this).find('.tooltip').remove();
    });

})();
