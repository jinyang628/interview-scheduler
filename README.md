# Interview Scheduler

This Chrome extension automatically schedules meetings on google calendar based on the information present in the the email content. It also helps you to draft a short appropriate reply to the sender.

## How to use

Clone this repository

## TODO

1. Let users set their own [client id](https://stackoverflow.com/questions/40411493/can-chrome-identity-launchwebauthflow-be-used-to-authenticate-against-google-api) instead of presetting it in manifest.json
2. Only schedule meetings for the opened conversation
3. Check if that slot is already booked and propose a different time given the constraints laid out by the sender (need to make additional API calls to google calendar)
