// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes, ActivityHandler } = require('botbuilder');

class MyBot extends ActivityHandler {
    constructor() {
        super();
    }
  
    async onTurn(turnContext) {

     const text = turnContext.activity.text;
 
     if (/^hi.*/i.test(text)) {
      // Function to send welcome text & continue assessment
     } else if (/^new.*/i.test(text)) {
      // Func to create new application
     } else if (/^delete.*/i.test(text)) {
      // Func to clear all record
     } else {
      // Do nothing
     }
      
    }
}

module.exports.MyBot = MyBot;
