# Duitku Auto Debet Example

This code is for learning purpose if you'd like to know about auto debet features from Duitku API payment gateways.

It use OVO linking payment.

To start with this example you may to fork the repository.

Clone to your local computer from your fork.

Run this command:
```
npm install
```

Before you run this project please make duitku config as like duitku-configuration.json
```json
{
    "merchantCode" : "DXXXX",
    "apiKey" : "XXXc6XXX31829bXXX74cd5XXXXX869XX",
    "passport" : false,
    "callbackUrl" : "http://localhost:3000/callback",
    "returnUrl" : "http://localhost:3000/bill/return",
    "accountLinkReturnUrl" : "http://localhost:3000/dashboard/",
    "expiryPeriod": 1440
}
```

for test callback please use a tunnel or try to deploy to your staging env to see what happen. or you can post the callback url using manual curl or postman.

for local test you may run this project by run this command
```
node index.js
```
or
```
nodemon index.js
```

For complete understanding please read also [Duitku docs](https://docs.duitku.com) and [npm duitku](https://www.npmjs.com/package/duitku).