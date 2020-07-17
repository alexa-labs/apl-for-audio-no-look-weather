/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG').
 * The localisation interceptor in index.js will automatically choose the strings
 * that match the request's locale.
 * */

module.exports = {
    en: {
        translation: {
            SKILL_NAME: 'APL Weather',
            HELP_MESSAGE: 'You can say what\'s the weather, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            FALLBACK_MESSAGE: 'The APL Weather skill can\'t help you with that.  It can tell you the weather if you say tell me the weather. What can I help you with?',
            FALLBACK_REPROMPT: 'What can I help you with?',
            ERROR_MESSAGE: 'Sorry, an error occurred.',
            STOP_MESSAGE: 'Goodbye!',
            WEATHER_REPORT: 'Right now it\'s {{currentTemp}} degrees and {{weatherDescription}}.'
        }
    },
    it: {
        translation: {
            SKILL_NAME: 'APL Meteo',
            HELP_MESSAGE: 'Puoi chiedermi com\'è il meteo o puoi chiudermi dicendo "esci"... Come posso aiutarti?',
            HELP_REPROMPT: 'Come posso aiutarti?',
            FALLBACK_MESSAGE: 'Non posso aiutarti con questo. Posso dirti com\'è il tempo, basta che mi chiedi: com\'è il meteo. Come posso aiutarti?',
            FALLBACK_REPROMPT: 'Come posso aiutarti?',
            ERROR_MESSAGE: 'Spiacente, si è verificato un errore.',
            STOP_MESSAGE: 'A presto!',
            WEATHER_REPORT: 'In questo momento ci sono {{temperature}} gradi e {{weatherDescription}}.'
        }
    }
}