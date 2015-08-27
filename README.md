# Lito
A node.js based system for providing show critical services on XTV live broadcasts.
Developed by Sam Hutchings and Niklas Rahmel

## Set-Up
Make sure to copy `/public/js/default.config.js` to `config.js` and fill out the necessary info.
Pull all necessary npm packages and you're ready to go!

## Screenshots
### Director's view
![Screenshot](/screenshots/director_view.png?raw=true)
Director's view with
* Time of Day
* Time since TX started
* ON AIR indicator
* Countdown (Custom and VT Remaining Time)
* Countdown settings
* Broadcast Message
* Intercom control with Tally and ACK indicators
* Schedule (not implemented)
* Log Out

## Known Issues
### Intercom
There may be issues with the intercom functionality if the page is reloaded by anybody after the director view has been loaded.
In order to re-connect all intercom connections, do the following:

1. Refresh all non-director views with talkback enabled
2. Refresh the director view

To avoid problems, make sure that no devices have an automatic screen turn-off or lock enabled; this is especially an issue on some smartphones.

A possible suggestion to fix this is to move the mute/listening states into a session-long database, so state is saved on the server, and on reconnect of each client (director or other), the mute/unmute states are re-established from what is saved in the database.

### Others
* Message acknowledgement is still work in progress
* Scheduling has not been implemented
