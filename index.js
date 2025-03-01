// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const restify = require('restify');
const path = require('path');
const bodyParser = require('body-parser'); 
const request = require('request'); 
const corsMiddleware = require('restify-cors-middleware'); 

// Read environment variables from .env file
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

const cors = corsMiddleware({ 
    origins: ['*'] 
  }); 
  
// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter, ConversationState, MemoryStorage, UserState } = require('botbuilder');

// Import required botbuilder-azure service.
// const { CosmosDbPartitionedStorage } = require('botbuilder-azure');

// Import our custom bot class that provides a turn handling function.
const { MainDialog } = require('./bots/mainDialog');
const { FounderProfileDialog } = require('./dialogs/founderProfileDialog');

// Create the adapter. See https://aka.ms/about-bot-adapter to learn more about using information from
// the .bot file when configuring the adapter.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Import WhatsApp Twilio adapter
// const { TwilioWhatsAppAdapter } = require('@botbuildercommunity/adapter-twilio-whatsapp');

// const whatsAppAdapter = new TwilioWhatsAppAdapter({
//     accountSid: process.env.accountSid, // Account SID
//     authToken: process.env.authToken, // Auth Token
//     phoneNumber: process.env.phoneNumber, // The From parameter consisting of whatsapp: followed by the sending WhatsApp number (using E.164 formatting)
//     endpointUrl: process.env.endpointUrl // Endpoint URL you configured in the sandbox, used for validation
// });

// // WhatsApp endpoint for Twilio
// server.post('/api/whatsapp/messages', (req, res) => {
//     whatsAppAdapter.processActivity(req, res, async (context) => {
//         // Route to main dialog.
//         await bot.run(context);
//     });
// });


// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, consider logging this to Azure
    //       application insights. See https://aka.ms/bottelemetry for telemetry 
    //       configuration instructions.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
    // Clear out state
    await conversationState.delete(context);
};

// Define the state store for bot.
// See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state storage system to persist the dialog and user state between messages.

//const memoryStorage = new MemoryStorage();
const memoryStorage = new CosmosDbPartitionedStorage({
    cosmosDbEndpoint: process.env.CosmosDbEndpoint,
    authKey: process.env.CosmosDbAuthKey,
    databaseId: process.env.CosmosDbDatabaseId,
    containerId: process.env.CosmosDbContainerId,
    compatibilityMode: false
});


// Create conversation state with in-memory storage provider.
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Create the main dialog.
const dialog = new FounderProfileDialog(userState);
const bot = new MainDialog(conversationState, userState, dialog);

// Create HTTP server.
const server = restify.createServer();
server.pre(cors.preflight); 
  server.use(cors.actual); 
  server.use(bodyParser.json({ 
    extended: false 
  }));
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log(`\n${ server.name } listening to ${ server.url }.`);
    console.log('\nTesting the POEM AI bot locally;');
    console.log('\nGet the Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to the POEM AI bot, open the emulator, and select "Open Bot"');
});

// Generates a Direct Line token 
server.post('/directline/token', async (_, res) => {
    console.log('requesting token ');
    try {
      const cres = await fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
        headers: { 
          authorization: `Bearer ${ process.env.DIRECT_LINE_SECRET }`
        },
        method: 'POST'
      });
  
      const json = await cres.json();
  
  
      if ('error' in json) {
        res.send(500);
      } else {
        res.send(json);
      }
    } catch (err) {
      res.send(500);
    }
  });

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Route the message to the bot's main handler.
        await bot.run(context);
    });
});
