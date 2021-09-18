// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { MessageFactory } = require('botbuilder');
const {
    AttachmentPrompt,
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    ConfirmPrompt,
    DialogSet,
    DialogTurnStatus,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');
//below is to get deployment channel
const { Channels } = require('botbuilder-core');
const { FounderProfile } = require('../founderProfile');

const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class FounderProfileDialog extends ComponentDialog {
    constructor(userState) {
        super('founderProfileDialog');

        this.founderProfile = userState.createProperty(USER_PROFILE);

        this.addDialog(new TextPrompt(NAME_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.agePromptValidator));
        this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT, this.picturePromptValidator));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.nameStep.bind(this),
            this.hasCofounderStep.bind(this),
            this.fulltimeStep.bind(this),
            this.ageStep.bind(this),
            this.ddShareStep.bind(this),
            this.baseCountryStep.bind(this),
            this.techEnbldStep.bind(this),
            this.fffraiseStep.bind(this),
            this.startupStageStep.bind(this),
            this.revenueStep.bind(this),
            this.employeesStep.bind(this),

            
            this.confirmStep.bind(this),
            this.summaryStep.bind(this)
            
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }


    async nameStep(step) {
        // Here's the beginning of the dialog.
        await step.context.sendActivity(`Hey, welcome!`);

        // READER: Note that WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.prompt(NAME_PROMPT, 'Kindly provide me with your name');
    }

    async hasCofounderStep(step) {
        step.values.name = step.result;
        // We can send messages to the user at any point in the WaterfallStep. But we had to save the previous result (founder name), to avoid being pushed off the stack
        await step.context.sendActivity(`Thanks, ${ step.values.name }.`);
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(CONFIRM_PROMPT, 'Do you have a cofounder?', ['yes', 'no']);
     
    }

    async fulltimeStep(step) {
        
        if (step.result) {
            // true for has cofounder
            return await step.prompt(CONFIRM_PROMPT, 'Are all your cofounders working full-time on the startup?', ['yes', 'no']);
        } else {
            // false for has cofounder
            await step.context.sendActivity(`Thanks. But you are not eligible.`);
            return await step.endDialog();
        }
    
    }

    async ageStep(step) {
        
        if (step.result) {
            // true for cofounders fulltime
            return await step.prompt(CONFIRM_PROMPT, 'Is your company less than 5 years old?', ['yes', 'no']);
        } else {
            // false for cofounders fulltime
            await step.context.sendActivity(`Thanks. But all cofounders need to be working fulltime on the startup.`);
            return await step.endDialog();
        }
     
    }

    async ddShareStep(step) {

        if (step.result) {
            // true for age of startup
            return await step.prompt(CONFIRM_PROMPT, 'Do you agree to share due diligence information with TVC Labs for the purposes of assessing your business for potential investment?', ['yes', 'no']);
        } else {
            // false for age of startup
            await step.context.sendActivity(`Thanks. You are not eligible, your startup needs to be at most 4 years old.`);
            return await step.endDialog();
        }
    
    }

    async baseCountryStep(step) {

        if (step.result) {
            // true for ddShare, ask follow up qstn
            return await step.prompt(CONFIRM_PROMPT, 'Is your startup company based in Nigeria?', ['yes', 'no']);
        } else {
            // false for ddShare
            await step.context.sendActivity(`Thanks. You are not eligible, because you'll need to provide us with due diligence information about your startup.`);
            return await step.endDialog();
        }
    
    }

    async techEnbldStep(step) {

        if (step.result) {
            // true for baseCountry, ask follow up qstn
            return await step.prompt(CONFIRM_PROMPT, 'Is your startup tech-enabled?', ['yes', 'no']);
        } else {
            // false for baseCountry
            await step.context.sendActivity(`Thanks. But you are not eligible.`);
            return await step.endDialog();
        }
    
    }

    async fffraiseStep(step) {

        if (step.result) {
            // true for techEnbld, ask follow up qstn
            const promptOptions = { prompt: 'How much in $USD  have you raised in FFF (Family & Friends) funding?', retryPrompt: 'The value entered must be a decimal.' };
            return await step.prompt(NUMBER_PROMPT, promptOptions);
        } else {
            // false for techEnbld
            await step.context.sendActivity(`Thanks. But you are not eligible. Your startup has to be technology enabled`);
            return await step.endDialog();
        }
    
    }

    async startupStageStep(step) {

        step.values.fffraise = step.result;

        if (step.values.fffraise >= 100) {
            // true for fffraise, ask follow up qstn
            return await step.prompt(CHOICE_PROMPT, {
                prompt: 'What stage is your startup currently?',
                choices: ChoiceFactory.toChoices(['Pre-MVP', 'Pre-Seed', 'Seed', 'Pre-Series A'])
            });
        } else {
            // false for fffraise
            await step.context.sendActivity(`Thanks. But you are not eligible. You must have raised $USD100 or more, in FFF funding.`);
            return await step.endDialog();
        }
    
    }

    async revenueStep(step) {

        step.values.startupStage = step.result.value;

        if (step.values.startupStage === 'Seed' || step.values.startupStage === 'Pre-Seed') {
            // true for startupStage, ask follow up qstn
            const promptOptions = { prompt: 'How much is your total revenue (in $USD) within the past 12 months?', retryPrompt: 'The value entered must be a decimal.' };
            return await step.prompt(NUMBER_PROMPT, promptOptions);
        } else {
            // false for startupStage
            await step.context.sendActivity(`Thanks. But you are not eligible. Your startup must be either Seed or Pre-Seed.`);
            return await step.endDialog();
        }
    
    }

    async employeesStep(step) {

        step.values.revenue = step.result;
        console.log('The startup revenue:', step.values.revenue);

        if (step.values.revenue >= 20000) {
            // true for revenue, ask follow up qstn
            const promptOptions = { prompt: 'How many employees do you have?', retryPrompt: 'The value entered must be a decimal.' };
            return await step.prompt(NUMBER_PROMPT, promptOptions);
        } else {
            // false for revenue
            await step.context.sendActivity(`Thanks. But you are not eligible. Your startup must have earned $USD20000 or more within the past 12 months.`);
            return await step.endDialog();
        }
    
    }


    //TODO: ADD ATTCHMNT HERE

    //TEMPS
    
    async confirmStep(step) {
      
        return await step.prompt(CONFIRM_PROMPT, { prompt: 'Do you agree to having your input data stored in our founders\' database?' });
    }

    async summaryStep(step) {
        if (step.result) {
            // Get the current profile object from user state.
            const founderProfile = await this.founderProfile.get(step.context, new FounderProfile());

            founderProfile.name = step.values.name;
            founderProfile.fffraise = step.values.fffraise;
            founderProfile.startupStage = step.values.startupStage;
            founderProfile.revenue = step.values.revenue;
            founderProfile.picture = step.values.picture;

            let msg = `I have your name as ${ founderProfile.name }, your FFF raise as ${ founderProfile.fffraise }, your startup stage as ${ founderProfile.startupStage }, and your startup revenue as ${ founderProfile.revenue }`;
            //if (founderProfile.age !== -1) {
              //  msg += ` I also have your age as ${ founderProfile.age }`;
            //}

           //TODO: Include attachment, if uploaded
           
            await step.context.sendActivity(msg);

        } else {
            await step.context.sendActivity('Thanks. Your profile will not be kept.');
        }

        // Here is the end of the whole dialog.
        return await step.endDialog();
    }

    async fffPromptValidator(promptContext) {
        // This condition is our validation rule. You can also change the value at this point.
        return promptContext.recognized.succeeded && promptContext.recognized.value > 0;
    }

    //TODO: If attchmnt, ADD ATTCHMNT PROMPT VALIDATOR HERE
}

module.exports.FounderProfileDialog = FounderProfileDialog;
