# Interview Scheduler

This Chrome extension automatically schedules meetings on google calendar based on the information present in the the email content. It also helps you to draft a short appropriate reply to the sender.

## Demo Video

https://github.com/user-attachments/assets/912bf500-fd43-4f18-8551-602799a3eaf5


## Setup

1. Download the extension and load the unpacked built extension into Chrome directly

   1. Download `interview-scheduler-vA.B.C.zip` from the [latest release](https://github.com/jinyang628/interview-scheduler/releases)
   2. Unzip the folder
   3. Navigate to `chrome://extensions/` in Chrome
   4. Toggle on `Developer mode` (Top right hand corner)
   5. Click on `Load unpacked` (Top left hand corner)
   6. Select the `dist/chrome-mv3` subfolder within the unzipped folder

2. Set up an OAuth project in Google Cloud Platform

   1. Obtain the redirect URI from the extension options page

3. Fill in all the required information in the options page

4. Open the email you want to schedule a meeting for

5. Click **Book Meeting** in the extension popup

## Future feature extensions

1. Only schedule meetings for the opened conversation
2. Refresh button to avoid the need to refresh the popup
3. Fix corrupted CSS from script injection

## Notes for self

1. Everytime I unpack an extension locally to test, I need to update the redirect uri in google cloud console
2. To release the distribution file, run the following commands

```bash
git tag vA.B.C
git push origin vA.B.C
```
