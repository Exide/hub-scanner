# hub-scanner
Simple tool for scanning a [Hub](http://github.com/flightstats/hub) channel for a specific item.

## scanBackwardsFromLatest

    $ node scanBackwardsFromLatest.js http://hub/channel/foo bar

This will start at the latest item in channel 'foo' and walk backwards, scanning the contents of each item looking for 'bar'. Scanning will only stop when reaching the beginning. I recommend killing the script (CTRL-C) when you're done scanning.

## scanBackwardsFromDate

    $ node scanBackwardsFromDate.js http://hub/channel/foo bar 1999-12-31

This operates the same as ```scanBackwardsFromLatest``` but instead of starting from ```latest``` it starts at the last entry on the date provided.
