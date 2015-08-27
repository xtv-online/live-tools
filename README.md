# Lito
A node.js based system for providing show critical services on XTV live broadcasts.
Developed by Sam Hutchings and Niklas Rahmel

## Set-Up
Make sure to copy `/public/js/default.config.js` to `config.js` and fill out the necessary info.
Pull all necessary npm packages and you're ready to go!

Settings for Server connections are available at <http://localhost:3000/config/> (or equivalent).

Role configuration is available at <http://localhost:3000/roles/> (or equivalent).

## Screenshots
### Director's view
![Screenshot](/screenshots/director_view.png?raw=true)
Director's view with
* Time of Day
* Time since TX started
* ON AIR indicator (click and hold to toggle)
* Countdown (Custom and VT Remaining Time)
* Countdown settings
* Broadcast Message
* Intercom control with Tally and ACK indicators
* Schedule (not implemented)
* Log Out

### Cam Op view
![Screenshot](/screenshots/camera_view_message.png?raw=true)
Camera Operator's view with
* Assigned short name
* ON AIR indicator (little L)
* Time of Day
* Countdown (Director's set or VT remaining)
* Message from Director & acknowledgement button
* Log-Out
* Fullscreen
* Intercom control

***Background colour*** changes depending on input's tally status (dark purple for stand-by, green if on PRV, red if on PGM)

### Multiview
![Screenshot](/screenshots/multiview.png?raw=true)
Multiview display (set to 1920*1080) with
* Time of Day
* ON AIR status
* Time since TX
* Director's Countdown
* Remaining time on VT

## Known Issues
### Intercom
There may be issues with the intercom functionality if the page is reloaded by anybody after the director view has been loaded.
In order to re-connect all intercom connections, do the following:

1. Refresh all non-director views with talkback enabled
2. Refresh the director view

To avoid problems, make sure that no devices have an automatic screen turn-off or lock enabled; this is especially an issue on some smartphones.

A possible suggestion to fix this is to move the mute/listening states into a session-long database, so state is saved on the server, and on reconnect of each client (director or other), the mute/unmute states are re-established from what is saved in the database.

### iOS
Intercom & Fullscreen mode not fully supported on iOS. This is a limitation by Apple and cannot be solved with a web-app

### Compatibility
We recommend to use Chrome for the director and the camera clients.
Firefox currently shows issues with the intercom, this is due to an issue with peerJS and should be fixable.
We do not recommend the use of Safari.
Microsoft EDGE and the latest version of Internet Explorer should be working, but this has not been tested.
### Others
* Message acknowledgement is still work in progress
* Scheduling has not been implemented
