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
            this.regLLCcfmStep.bind(this),
            this.regLLCStep.bind(this),
            this.mnthcfmStep.bind(this),
            this.mnthOpnStep.bind(this),
            this.fulltimeStep.bind(this),
            this.hasCofounderStep.bind(this),
            this.techEnbldStep.bind(this),
            this.industryStep.bind(this),
            this.mvpcfmStep.bind(this),
            this.mvpStep.bind(this),
            this.prevRaisecfmStep.bind(this),
            this.prevRaiseStep.bind(this),
            this.revenueStep.bind(this),
            this.employeesStep.bind(this),
            this.femaleFTEStep.bind(this),
            this.nigerianEduStep.bind(this),
            this.baseCountryStep.bind(this),
            this.sdgStep.bind(this),
            this.learnStep.bind(this),
            this.equityStep.bind(this),
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
        await step.context.sendActivity(`Good day, thank you for contacting TVC Labs!`);

        // READER: Note that WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.prompt(NAME_PROMPT, 'What\'s your first name?');
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
            await step.context.sendActivity(`Kindly go ahead and take your CVI here: https://markschall.com/core-values-index-cvi-free-assessment`);
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
            await step.context.sendActivity(`Thanks again. But you need to have a Pitch Deck before proceeding.`);
            await step.context.sendActivity(`Kindly go ahead and use the format in this document to create your pitch deck: https://www2.slideshare.net/TomiDee/pitching-to-investors-using-poem`);
            return await step.prompt(NAME_PROMPT, 'And provide the link to your created pitch deck, below:');
        }
    
    }

    async poemcfmStep(step) {
        step.values.pitchDeck = step.result;

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
            await step.context.sendActivity(`Thanks again. But you need to have a POEM profile before proceeding.`);
            await step.context.sendActivity(`Kindly go ahead and use the format in this document to create your POEM profile: https://docs.google.com/document/d/1VS8PwANzLhSQVPErus6XqDPs4b7uNzW8_j9zYjT6Y0c/edit?usp=sharing`);
            return await step.prompt(NAME_PROMPT, 'And provide the link to your created POEM profile, below:'); 
        }
    
    }

    async regLLCcfmStep(step) {

        step.values.poemProfile = step.result;

        console.log(step.values.poemProfile);

        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(CONFIRM_PROMPT, `${ step.values.fname }, is your startup company registered?`, ['yes', 'no']);
     
    }

    async regLLCStep(step) {

        if (step.result) {
            // true for has regLLC
            return await step.prompt(NAME_PROMPT, 'Please provide the link to a copy of your CAC incorporation document:');
            
        } else {
            // false for regLLC 
            await step.context.sendActivity(`Thanks. But your startup needs to be a registered company.`);
            return await step.endDialog(); 
        }
    
    }

    async mnthcfmStep(step) {

        step.values.cacLink = step.result;

        console.log(step.values.cacLink);

        const promptOptions = { prompt: 'How many months has your startup been in operation?', retryPrompt: 'The value entered must be a decimal.' };
        return await step.prompt(NUMBER_PROMPT, promptOptions);
    }

    async mnthOpnStep(step) {

        step.values.mnthOpn = step.result;

        if (step.values.mnthOpn > 60 || step.values.mnthOpn < 6) {
            // true, terminate
            step.values.prevRaise = 0;
            await step.context.sendActivity(`Thanks. But your startup's months of operation must be between 6 months to 5 years of operation.`);
            return await step.endDialog();

            
        } else {
            // false, ask follow up
            return await step.prompt(CONFIRM_PROMPT, `${ step.values.fname }, are you working full-time on your startup?`, ['yes', 'no']);
            
        }
    
    }

    async fulltimeStep(step) {

        if (step.result) {
            // true for fulltime
            return await step.prompt(CONFIRM_PROMPT, `${ step.values.fname }, do you have a co-founder?`, ['yes', 'no']);
        } else {
            // false for fulltime 
            await step.context.sendActivity(`Thanks. But you must be working full-time on your startup.`);
            return await step.endDialog();
        }
    
    }


    async hasCofounderStep(step) {

        if (step.result) {
            // true for hasCofounder
            return await step.prompt(CONFIRM_PROMPT, `${ step.values.fname }, is your startup a technology-enabled business?`, ['yes', 'no']);
        } else {
            // false for hasCofounder 
            await step.context.sendActivity(`Thanks. But you must have a co-founder.`);
            return await step.endDialog();
        }
    }


    async techEnbldStep(step) {
        
        if (step.result) {
            // true for techEnbld, ask follow up qstn
            return await step.prompt(CHOICE_PROMPT, {
                prompt: 'What industry sector does your startup operate in?',
                choices: ChoiceFactory.toChoices(['Health (Healthtec)', 'Education (Edutec)', 'Retail (eCommerce)', 'Finance & Banking (Fintech)', 'Agriculture (Agritec)', 'Enterprise (SaaS)', 'Renewables (Energy)', 'Logistics (Mobility)', 'Other'])
            });
        } else {
            // false for techEnbld
            await step.context.sendActivity(`Thanks. But your startup must be tech-enabled.`);
            return await step.endDialog();
        }
    
    }

    async industryStep(step) {

        step.values.industry = step.result.value;

        console.log(step.values.industry);

        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(CONFIRM_PROMPT, `${ step.values.fname }, has your startup built a Minimum Viable Product (MVP)?`, ['yes', 'no']);
    
    }

    async mvpcfmStep(step) {

        if (step.result) {
            // true for hasMVP
            return await step.prompt(NAME_PROMPT, 'Please provide a link to your website (if any, otherwise put None):');
            
        } else {
           // false for hasMVP 
           await step.context.sendActivity(`Thanks. But your startup must have built an MVP.`);
           return await step.endDialog();
        }
    }

    async mvpStep(step) {

        step.values.mvp = step.result;
        console.log(step.values.mvp);

        return await step.prompt(CONFIRM_PROMPT, `${ step.values.fname }, has your startup raised capital from investors before?`, ['yes', 'no']);
        
    }

    async prevRaisecfmStep(step) {

        if (step.result) {
            // true for has prevRaise
            return await step.prompt(NUMBER_PROMPT, 'Great. How much capital (in $USD) has your startup raised from investors since you started?');
            
        } else {
            // false for has prevRaise
            return await step.next(0);    
        }
    
    }

    async prevRaiseStep(step) {
        step.values.prevRaise = step.result;
        console.log(step.values.prevRaise);
        const msg = step.values.prevRaise === 0 ? 'Thanks. It has been recorded that you have never raised capital from investors.' : `Great. It has been recorded that you've raised $USD${ step.values.prevRaise }.`;

        await step.context.sendActivity(msg);

        

        console.log(step.values.prevRaise);
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(NUMBER_PROMPT, `${ step.values.fname }, how much (if any) revenue in $USD have you generated in the last 12 months?`);
     
    }

    async revenueStep(step) {

        step.values.revenue = step.result;

        console.log(step.values.revenue);

        if (step.values.revenue <= 0) {

            step.values.startupStage = 'Pre-Revenue';
            await step.context.sendActivity(`Thanks. Your startup stage has been identified as ${ step.values.startupStage }.`);
            
            return await step.prompt(NUMBER_PROMPT, `${ step.values.fname }, how many full-time staff (including your co-founder) does your startup have?`);
     
        } else if (step.values.revenue > 0 && step.values.revenue < 12000) {
            
            step.values.startupStage = 'MVP';
            await step.context.sendActivity(`Thanks. Your startup stage has been identified as ${ step.values.startupStage }.`);
            
            return await step.prompt(NUMBER_PROMPT, `${ step.values.fname }, how many full-time staff (including your co-founder) does your startup have?`);
     
        } else if (step.values.revenue >= 12000 && step.values.revenue < 100000) {
           
            step.values.startupStage = 'Pre-Seed';
            await step.context.sendActivity(`Thanks. Your startup stage has been identified as ${ step.values.startupStage }.`);
            
            return await step.prompt(NUMBER_PROMPT, `${ step.values.fname }, how many full-time staff (including your co-founder) does your startup have?`);
     
        } else {
            step.values.startupStage = 'Seed';
            await step.context.sendActivity(`Thanks. Your startup stage has been identified as ${ step.values.startupStage }.`);
            
            return await step.prompt(NUMBER_PROMPT, `${ step.values.fname }, how many full-time staff (including your co-founder) does your startup have?`);
        }
    
    }

    async employeesStep(step) {

        console.log(step.values.startupStage);
        step.values.fullTimeStaff = step.result;
        console.log(step.values.fullTimeStaff);

        if (step.values.fullTimeStaff >= 4) {
            return await step.prompt(NUMBER_PROMPT, 'How many of your startup\'s full-time staff are female (including your co-founder)?');
        } else {
            await step.context.sendActivity(`Thanks. You are not eligible, your startup needs to have at least 4 full-time staffs (including co-founders).`);
            return await step.endDialog();
        }
    
    }

    async femaleFTEStep(step) {

        step.values.femaleFTE = step.result;
        console.log(step.values.femaleFTE);

        step.values.ratio = step.values.fullTimeStaff * 0.3;

        if (step.values.femaleFTE >= step.values.ratio) {
            // true for > ratio
            return await step.prompt(CONFIRM_PROMPT, 'Did you go to school in a Nigerian Institution? ');
        } else {
            // false for > ratio
            await step.context.sendActivity(`Thanks. You are not eligible, your female staff need to be at least 30% of your full-time staffs.`);
            return await step.endDialog();
        }
    
    }


    async nigerianEduStep(step) {

        if (step.result == 'true' && step.values.startupStage == 'Pre-Revenue') {

            await step.context.sendActivity(`Thanks. You are not eligible, your startup needs to be at MVP, Pre-Seed, or Seed.`);
            return await step.endDialog();
            
        } else if (step.result == 'false') {
            
            await step.context.sendActivity(`Thanks. You are not eligible, you need to have attended a Nigerian institution.`);
            return await step.endDialog();
     
        } else {
            return await step.prompt(CHOICE_PROMPT, {
                prompt: 'What country (or countries) do you operate in?',
                choices: ChoiceFactory.toChoices(['Ivory Coast', 'Egypt', 'Ghana', 'Kenya', 'Nigeria', 'Senegal', 'Other'])
            });
        }
    
    }

    async baseCountryStep(step) {

        step.values.baseCountry = step.result.value;
        console.log(step.values.baseCountry);

        const countryList = ['Ivory Coast', 'Egypt', 'Ghana', 'Kenya', 'Nigeria', 'Senegal'];

        if (step.values.baseCountry != 'Nigeria' && step.values.startupStage == 'Pre-Seed') {
            // true for condition not met
            await step.context.sendActivity(`Thanks. You are not eligible. Your startup is Pre-Seed, based on this, your startup needs to be operational in Nigeria.`);
            return await step.endDialog();
        } else if (countryList.includes(step.values.baseCountry) == false && step.values.startupStage == 'Seed') {
            await step.context.sendActivity(`Thanks. You are not eligible. Your startup needs to be seed stage and be operational in any of the ffg countries: Ivory Coast, Egypt, Ghana, Kenya, Nigeria or Senegal.`);
            return await step.endDialog();
            //if condition met, but prevRaise = 0
        } else if (step.values.prevRaise == 0) {
            return await step.prompt(CONFIRM_PROMPT, 'Would you be prepared to give us equity shares in your startup in return for our investment-readiness Advisory services?');
        } else {
            return await step.next(-1);        
        }    
    }


    async sdgStep(step) {

        if (step.result) {

            return await step.prompt(NAME_PROMPT, 'How does your startup contribute to positive social and/or environmental impact? (which SDGs?)');
            

            // true, ask follow up qstn
            //return await step.prompt(CHOICE_PROMPT, {
              //  prompt: 'How does your startup contribute to positive social and/or environmental impact?',
                //choices: ChoiceFactory.toChoices(['GOAL 1: No Poverty', 'Egypt', 'Ghana', 'Kenya', 'Nigeria', 'Senegal'])
            //});
        
        } else {
            // false for ddShare
            await step.context.sendActivity(`Thanks. You are not eligible. We will be needing equity shares in your startup in return for our investment-readiness Advisory services.`);
            return await step.endDialog();
        }
    
    }

    async learnStep(step) {
        console.log(step.result);
        step.values.sdg = step.result;

        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(NAME_PROMPT, 'How did you learn about TD, TVC Labs or Greentec?');
     
    }

    async equityStep(step) {
        console.log(step.result);
        step.values.ref = step.result;

        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(CONFIRM_PROMPT, 'Do you agree to share due diligence information with TVC Labs for the purposes of assessing your business for potential investment?');
     
    }

  ////STOP  

    //TODO: ADD ATTCHMNT HERE

    //TEMPS

    async summaryStep(step) {
        if (step.result) {
            // Get the current profile object from user state.
            const founderProfile = await this.founderProfile.get(step.context, new FounderProfile());


            founderProfile.fname = step.values.fname;
            founderProfile.lname = step.values.lname;
            founderProfile.email = step.values.email;
            founderProfile.linkedin = step.values.linkedin;
            founderProfile.cvi = step.values.cvi;
            founderProfile.facebook = step.values.facebook;
            founderProfile.twitter = step.values.twitter;
            founderProfile.instagram = step.values.instagram;
            founderProfile.startupname = step.values.startupname;
            founderProfile.startupDesc = step.values.startupDesc;
            founderProfile.pitchDeck = step.values.pitchDeck;
            founderProfile.poemProfile = step.values.poemProfile;
            founderProfile.mnthOpn = step.values.mnthOpn;
           
            let msg = `Thanks, ${ founderProfile.fname }. \n\n
            I have your last name as ${ founderProfile.lname }, \n\n
            your email as ${ founderProfile.email }, \n\n
            the link to your linkedin as ${ founderProfile.linkedin }, \n\n
            the link to your cvi as ${ founderProfile.cvi }, \n\n
            the link to your facebook as ${ founderProfile.facebook }, \n\n
            the link to your instagram as ${ founderProfile.instagram }, \n\n
            the link to your twitter as ${ founderProfile.twitter }, \n\n
            your startup name as ${ founderProfile.startupname }, \n\n
            a description of your startup as ${ founderProfile.startupDesc }, \n\n
            the link to your pitch deck as ${ founderProfile.pitchDeck }, \n\n
            the link to your POEM profile as ${ founderProfile.poemProfile }, \n\n
            your months of operation as ${ founderProfile.mnthOpn },`;
            //if (founderProfile.age !== -1) {
              //  msg += ` I also have your age as ${ founderProfile.age }`;
            //}

           //TODO: Include attachment, if uploaded
           
            await step.context.sendActivity(msg);

        } else {
            await step.context.sendActivity('Thanks. Your profile will not be kept, and this has made your startup ineligible.');
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
