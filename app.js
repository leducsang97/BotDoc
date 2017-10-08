/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
var symptoms =  
{'Abdominal pain': 10,
  'Anxiety': 238,
  'Back pain': 104,
  'Burning eyes': 75,
  'Burning in the throat': 46,
  'Cheek swelling': 170,
  'Chest pain': 17,
  'Chest tightness': 31,
  'Chills': 175,
  'Cold sweats': 139,
  'Cough': 15,
  'Dizziness': 207,
  'Drooping eyelid': 244,
  'Dry eyes': 273,
  'Earache': 87,
  'Early satiety': 92,
  'Eye pain': 287,
  'Eye redness': 33,
  'Fast, deepened breathing': 153,
  'Feeling of foreign body in the eye': 76,
  'Fever': 11,
  'Going black before the eyes': 57,
  'Headache': 9,
  'Heartburn': 45,
  'Hiccups': 122,
  'Hot flushes': 149,
  'Increased thirst': 40,
  'Itching eyes': 73,
  'Itching in the nose': 96,
  'Lip swelling': 35,
  'Memory gap': 235,
  'Menstruation disorder': 112,
  'Missed period': 123,
  'Nausea': 44,
  'Neck pain': 136,
  'Nervousness': 114,
  'Night cough': 133,
  'Pain in the limbs': 12,
  'Pain on swallowing': 203,
  'Palpitations': 37,
  'Paralysis': 140,
  'Reduced appetite': 54,
  'Runny nose': 14,
  'Shortness of breath': 29,
  'Skin rash': 124,
  'Sleeplessness': 52,
  'Sneezing': 95,
  'Sore throat': 13,
  'Sputum': 64,
  'Stomach burning': 179,
  'Stuffy nose': 28,
  'Sweating': 138,
  'Swollen glands in the armpits': 248,
  'Swollen glands on the neck': 169,
  'Tears': 211,
  'Tiredness': 16,
  'Tremor at rest': 115,
  'Unconsciousness, short': 144,
  'Vomiting': 101,
  'Vomiting blood': 181,
  'weakness': 56,
  'Weight gain': 23,
  'Wheezing': 30 };

// symptoms_reg = RegExp('^' + symptoms_reg.substr(1) + '$');


// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

var yourSymptoms = [];

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/

.matchesAny(Object.keys(symptoms), [function(session,args,next){
    yourSymptoms.push(args.intent);
}])

.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
    
});


// bot.dialog('/test',"asdfaf");


bot.dialog('/', intents);    

