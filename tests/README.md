
# POEM AI tests

Bot Framework v4 bot tests for `POEM AI` bot.

This project uses the [botbuilder-testing](https://www.npmjs.com/package/botbuilder-testing) package and [mocha](https://github.com/mochajs/mocha) to create unit tests for your bot.

This project shows how to:

- Create unit tests for dialogs and bots
- Create different types of data driven tests using mocha tests
- Create mock objects for the different dependencies of a dialog (i.e. LUIS recognizers, other dialogs, configuration, etc.)
- Assert the activities returned by a dialog turn against expected values
- Assert the results returned by a dialog

## Overview

In this sample, dialogs are unit tested through the `DialogTestClient` class which provides a mechanism for testing them in isolation outside of a bot and without having to deploy your code to a web service.

This class is used to write unit tests for dialogs that test their responses on a turn-by-turn basis. Any dialog built using the botbuilder dialogs library should work.

Here is a simple example on how a test that uses `DialogTestClient` looks like:

```javascript
const sut = new PoemDialog();
const testClient = new DialogTestClient('msteams', sut);

let reply = await testClient.sendActivity('hi');
assert.strictEqual(reply.text, 'Welcome to POEM AI. Will you like to proceed with my founder's assessment?');
```

## Further reading

- [How to unit test bots](https://aka.ms/js-unit-test-docs)
- [Mocha](https://github.com/mochajs/mocha)
- [Bot Testing](https://github.com/microsoft/botframework-sdk/blob/master/specs/testing/testing.md)
