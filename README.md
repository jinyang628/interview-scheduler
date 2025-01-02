# Interview Scheduler

This Chrome extension automatically schedules meetings on google calendar based on the information present in the the email content. It also helps you to draft a short appropriate reply to the sender.

## Demo Video

~PLACEHOLDER~

## Setup

1. Chrome Web Store (PENDING)
2. Download and load unpacked `dist/chrome-mv3` folder in chrome directly

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
