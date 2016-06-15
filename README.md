# hub-scanner
Simple tool for scanning a Hub channel for a specific item.

## scanBackwardsFromLatest

    $ node scanBackwardsFromLatest.js http://hub/channel/foo bar

This will start at the latest item in channel 'foo' and walk backwards, scanning the contents of each item looking for 'bar'. Scanning will only stop when reaching the beginning. I recommend killing the script (CTRL-C) when you're done scanning.
