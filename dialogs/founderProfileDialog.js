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
        this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.fffPromptValidator));
        //this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT, this.picturePromptValidator));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.firstNameStep.bind(this),
            this.lastNameStep.bind(this),
            this.emailStep.bind(this),
            this.linkedincfmStep.bind(this),
            this.linkedInStep.bind(this),
            this.cvicfmStep.bind(this),
            this.cviStep.bind(this),
            this.twtcfmStep.bind(this),
            this.twitterStep.bind(this),
            this.instcfmStep.bind(this),
            this.instagramStep.bind(this),
            this.fbcfmStep.bind(this),
            this.facebookStep.bind(this),
            this.startupNameStep.bind(this),
            this.startupDescStep.bind(this),
            this.pitchcfmStep.bind(this),
            this.pitchDeckStep.bind(this),
            this.poemcfmStep.bind(this),
            this.poemProfileStep.bind(this),
            //this.regLLCStep.bind(this),
            this.mnthOpnStep.bind(this),
            this.fulltimeStep.bind(this),
            this.hasCofounderStep.bind(this),
            this.techEnbldStep.bind(this),
            //this.industryStep.bind(this),
            //this.mvpStep.bind(this),
            this.prevRaiseStep.bind(this),
            this.revenueStep.bind(this),
            this.startupStageStep.bind(this),
            this.employeesStep.bind(this),
            //this.fteStaffStep.bind(this),
            //this.femaleFTEStep.bind(this),
            //this.nigerianEduStep.bind(this),
            this.baseCountryStep.bind(this),
            //this.equityStep.bind(this),
            //this.sdgStep.bind(this),
            //this.learnStep.bind(this),
            this.ddShareStep.bind(this),

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


    async firstNameStep(step) {
        // Here's the beginning of the dialog.
        await step.context.sendActivity(`Hey, welcome!`);

        // READER: Note that WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.prompt(NAME_PROMPT, 'Kindly provide me with your first name');
    }

    
    async lastNameStep(step) {
        console.log(step.result);
        step.values.fname = step.result;

        // We can send messages to the user at any point in the WaterfallStep. But we had to save the previous result (founder name), to avoid being pushed off the stack
        await step.context.sendActivity(`Thanks, ${ step.values.fname }.`);
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(NAME_PROMPT, 'What\'s your last name?');
     
    }

    async emailStep(step) {
        console.log(step.result);
        step.values.lname = step.result;

        // We can send messages to the user at any point in the WaterfallStep. But we had to save the previous result (founder name), to avoid being pushed off the stack
        await step.context.sendActivity(`Thanks, ${ step.values.fname }.`);
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(NAME_PROMPT, 'What\'s your email address?');
     
    }

    async linkedincfmStep(step) {
        step.values.email = step.result;
        console.log(step.values.lname);
        console.log(step.values.email);
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(CONFIRM_PROMPT, `${ step.values.fname }, do you have a LinkedIn account?`, ['yes', 'no']);
     
    }

    async linkedInStep(step) {

        if (step.result) {
            // true for has linkedin
            return await step.prompt(NAME_PROMPT, 'Please provide a link to your LinkedIn profile:');
            
        } else {
            // false for has linkedin
            await step.context.sendActivity(`Thanks. But you need to have a LinkedIn profile before proceeding.`);
            await step.context.sendActivity(`Kindly go ahead in creating a LinkedIn profile here: https://linkedin.com`);
            return await step.prompt(NAME_PROMPT, 'And provide the link to your newly-created LinkedIn profile, below:');
        }
    
    }

    async cvicfmStep(step) {
        step.values.linkedin = step.result;
        console.log(step.values.linkedin);
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(CONFIRM_PROMPT, `Thanks, ${ step.values.fname }. Do you have a CVI?`, ['yes', 'no']);
     
    }

    async cviStep(step) {

        if (step.result) {
            // true for has cvi
            return await step.prompt(NAME_PROMPT, 'Please provide a link to your CVI:');
            
        } else {
            // false for has cvi
            await step.context.sendActivity(`Thanks again. But you need to have a CVI before proceeding.`);
            await step.context.sendActivity(`Kindly go ahead and take your CVI here: https://markschall.com`);
            return await step.prompt(NAME_PROMPT, 'And provide the link to your CVI result, below:');
        }
    
    }

    async twtcfmStep(step) {
        step.values.cvi = step.result;
        console.log(step.values.cvi);
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(CONFIRM_PROMPT, `${ step.values.fname }, do you have a Twitter account?`, ['yes', 'no']);
     
    }

    async twitterStep(step) {

        if (step.result) {
            // true for has twitter
            return await step.prompt(NAME_PROMPT, 'Please provide a link to your Twitter profile:');
            
        } else {
            // false for has twitter
            return await step.next('Negative');
        }
    
    }

    async instcfmStep(step) {
        step.values.twitter = step.result;
        const msg = step.values.twitter === 'Negative' ? 'Thanks. It has been recorded that you have no Twitter account.' : `I have the link to your Twitter profile as: ${ step.values.twitter }.`;

        await step.context.sendActivity(msg);

        

        console.log(step.values.twitter);
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(CONFIRM_PROMPT, `${ step.values.fname }, do you have an Instagram account?`, ['yes', 'no']);
     
    }

    async instagramStep(step) {

        if (step.result) {
            // true for has Instagram
            return await step.prompt(NAME_PROMPT, 'Please provide a link to your Instagram profile:');
            
        } else {
            // false for has Instagram
            return await step.next('Negative');    
        }
    
    }

    async fbcfmStep(step) {

        step.values.instagram = step.result;
        const msg = step.values.instagram === 'Negative' ? 'Thanks. It has been recorded that you have no Instagram account.' : `I have the link to your Instagram profile as: ${ step.values.instagram }.`;

        await step.context.sendActivity(msg);

        

        console.log(step.values.instagram);
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(CONFIRM_PROMPT, `${ step.values.fname }, do you have a Facebook account?`, ['yes', 'no']);
     
    }

    async facebookStep(step) {

        if (step.result) {
            // true for has Facebook
            return await step.prompt(NAME_PROMPT, 'Please provide a link to your Facebook profile:');
            
        } else {
            // false for has Facebook
            return await step.next('Negative');  
        }
    
    }

    async startupNameStep(step) {
        step.values.facebook = step.result;
        const msg = step.values.facebook === 'Negative' ? 'Thanks. It has been recorded that you have no Facebook account.' : `I have the link to your Facebook profile as: ${ step.values.facebook }.`;

        await step.context.sendActivity(msg);

        

        console.log(step.values.facebook);
       
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(NAME_PROMPT, 'What\'s your startup\'s name?');
     
    }

    async startupDescStep(step) {
        console.log(step.result);
        step.values.startupname = step.result;

        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(NAME_PROMPT, 'Please describe your startup in a tweet:');
     
    }

    async pitchcfmStep(step) {
        step.values.startupDesc = step.result;
        console.log(step.values.startupDesc);
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(CONFIRM_PROMPT, `${ step.values.fname }, do you have a pitch deck?`, ['yes', 'no']);
     
    }

    async pitchDeckStep(step) {

        if (step.result) {
            // true for has pitchDeck
            return await step.prompt(NAME_PROMPT, 'Please provide the link to your startup\'s pitch deck:');
            
        } else {
            // false for has pitchDeck
            return await step.next('Negative');  
        }
    
    }

    async poemcfmStep(step) {
        step.values.pitchDeck = step.result;
        const msg = step.values.pitchDeck === 'Negative' ? 'Thanks. It has been recorded that you have no pitch deck.' : `I have the link to your pitch deck as: ${ step.values.pitchDeck }.`;

        await step.context.sendActivity(msg);

        console.log(step.values.pitchDeck);
       
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(CONFIRM_PROMPT, `${ step.values.fname }, do you have a POEM profile?`, ['yes', 'no']);
     
    }

    async poemProfileStep(step) {

        if (step.result) {
            // true for has poemProfile
            return await step.prompt(NAME_PROMPT, 'Please provide the link to your startup\'s POEM profile:');
            
        } else {
            // false for has poemProfile
            return await step.next('Negative');  
        }
    
    }

    async hasCofounderStep(step) {

        step.values.poemProfile = step.result;
        const msg = step.values.poemProfile === 'Negative' ? 'Thanks. It has been recorded that you have no POEM profile.' : `I have the link to your POEM profile as: ${ step.values.poemProfile }.`;

        await step.context.sendActivity(msg);

        console.log(step.values.poemProfile);

        console.log(step.values.fname);
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(CONFIRM_PROMPT, `${ step.values.fname }, do you have a cofounder?`, ['yes', 'no']);
     
    }

    async fulltimeStep(step) {
        
        if (step.result) {
            // true for has cofounder
            trn = `Test age step`;
            return await step.context.sendActivity(trn); 
            
            //return await step.prompt(CONFIRM_PROMPT, 'Are all your cofounders working full-time on the startup?', ['yes', 'no']);
        } else {
            // false for has cofounder
            await step.context.sendActivity(`Thanks. But you are not eligible.`);
            return await step.endDialog();
        }
    
    }

    async mnthOpnStep(step) {
        
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

    async prevRaiseStep(step) {

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

        step.values.prevRaise = step.result;

        if (step.values.prevRaise >= 100) {
            // true for prevRaise, ask follow up qstn
            return await step.prompt(CHOICE_PROMPT, {
                prompt: 'What stage is your startup currently?',
                choices: ChoiceFactory.toChoices(['Pre-MVP', 'Pre-Seed', 'Seed', 'Pre-Series A'])
            });
        } else {
            // false for prevRaise
            step.values.prevRaise = 0;
            return await step.context.sendActivity(`Thanks. But you are not eligible. You must have raised $USD100 or more, in FFF funding.`);
            //return await step.endDialog();
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
            founderProfile.prevRaise = step.values.prevRaise;
            founderProfile.startupStage = step.values.startupStage;
            founderProfile.revenue = step.values.revenue;
            founderProfile.picture = step.values.picture;

            let msg = `I have your name as ${ founderProfile.name }, your FFF raise as ${ founderProfile.prevRaise }, your startup stage as ${ founderProfile.startupStage }, and your startup revenue as ${ founderProfile.revenue }`;
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
