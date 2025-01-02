# Interview Scheduler

This Chrome extension automatically schedules meetings on google calendar based on the information present in the the email content. It also helps you to draft a short appropriate reply to the sender.

## Demo Video

~PLACEHOLDER~

## Setup

1. Install the extension

   1. Install directly from the Chrome Web Store (PENDING APPROVAL)
   2. Download and load the unpacked built extension into Chrome directly
      1. Download `interview-scheduler-vA.B.C.zip` from the [latest release](https://github.com/jinyang628/interview-scheduler/releases)
      2. Unzip the folder
      3. Navigate to `chrome://extensions/` in Chrome
      4. Toggle on `Developer mode` (Top right hand corner)
      5. Click on `Load unpacked` (Top left hand corner)
      6. Select the `dist/chrome-mv3` subfolder within the unzipped folder

2. Fill in all the required information in the options page

3. Open the email you want to schedule a meeting for

4. Click **Book Meeting** in the extension popup

## TODO

1. Only schedule meetings for the opened conversation
2. Let users indicate preferences of timeslots to book/avoid
3. Fix corrupted CSS from script injection

## Notes

1. Everytime I unpack an extension locally to test, I need to update the redirect uri in google cloud console
2. To release the distribution file, run the following commands

```bash
git tag vA.B.C
git push origin vA.B.C
```
