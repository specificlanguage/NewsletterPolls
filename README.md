# NewsletterPolls

This is a simple repo that just sends poll responses from a client to the database. This script does not request any information about the client and all data is anonymized. If you need a database to host poll data on, [I highly recommend Neon for this use case.](https://neon.tech/)
It can be hosted on an AWS Lambda with an API Gateway endpoint with ease, as long as you provide a valid database URL and credentials (feel free to change the information on line 9 if needed.)
This is [intended for use with the namesake newsletter.](https://github.com/specificlanguage/newsletter-astro).

Usage: use a POST request with the following body: 
```
{
  "slug": "[page route here, although anything suffices]",
  "[questionID]": "answer,separated,by,comma",
  "[questionID2]": "you,can,fit,as,many,answers,as,needed",
  ...
}
```
