# Metros Status Update

## Usage

Text (587) 801-7290

#### First Time Setup

If you want Line 1 at Union St, text:
```
setup line1 union 
```

Then you can text "status" for an update on the status

## Requirements
npm:
- twilio
- twilio-api


## Setup

1. [Set the Twilio SID and Auth Token](https://www.twilio.com/docs/twilio-cli/general-usage#want-to-use-environment-variables-instead-of-creating-a-profile) as environment variables
2. Run the receiver with
```
# Assumed useris in 'server/'
node receiver.js
```
3. Start the tunnel using the twilio cli
```
twilio phone-numbers:update "+15878017290" --sms-url="http://localhost:1337/sms"
```

