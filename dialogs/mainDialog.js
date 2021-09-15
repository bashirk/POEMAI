// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes, ActivityHandler } = require('botbuilder');

class MyBot extends ActivityHandler {
    constructor() {
        super();
    }
  
    async onTurn(turnContext) {
      
    }
}

module.exports.MyBot = MyBot;
