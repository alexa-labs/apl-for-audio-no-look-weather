// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

// sets up dependencies
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const languageStrings = require('./languageStrings');

// core functionality for fact skill
const GetWeatherHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        // checks request type
        return request.type === 'LaunchRequest'
            || (request.type === 'IntentRequest'
                && request.intent.name === 'GetWeatherIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        // the following constants are hardcoded for demo purposes only.
        // In a real skill these values would be pulled from an API
        const weatherCode = 01
        const weatherDescription = 'cloudy'
        const currentTemp = 70

        // the values above will be inserted into the SSML before it's sent to the APL response
        const ssml = requestAttributes.t('WEATHER_REPORT', { currentTemp: currentTemp, weatherDescription: weatherDescription });
        let audio = '';
        let bgImage = '';

        // logic to determine which assets should be paired with the forecast
        if (weatherCode === 01) {
            audio = 'soundbank://soundlibrary/animals/amzn_sfx_bird_forest_short_01'
            bgImage = 'https://images.pexels.com/photos/777211/winter-sunset-purple-sky-777211.jpeg'
        } else if (weatherCode === 02) {
            audio = 'soundbank://soundlibrary/nature/amzn_sfx_rain_03'
            bgImage = 'https://images.pexels.com/photos/1089455/pexels-photo-1089455.jpeg'
        }


        // Add APL directive to response
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // Create Render Directive
            handlerInput.responseBuilder
                .addDirective({
                    "type": "Alexa.Presentation.APL.RenderDocument",
                    "token": "token",
                    "document": {
                        "type":"Link",
                        "src":  "doc://alexa/apl/documents/weather_v"
                    },
                    "datasources": {
                        "myData": {
                            "bgImage": bgImage,
                            "currentTemp": currentTemp,
                            "weatherDescription": weatherDescription
                        }
                    }
                })
        }

        return handlerInput.responseBuilder
            .addDirective({
                "type": "Alexa.Presentation.APLA.RenderDocument",
                "token": "token",
                "document": {
                    "type":"Link",
                    "src":  "doc://alexa/apla/documents/weather_a"
                },
                "datasources": {
                    "myData": {
                        "ssml": ssml,
                        "audio": audio
                    }
                }
            })
            .getResponse();
    },
};

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('HELP_MESSAGE'))
            .reprompt(requestAttributes.t('HELP_REPROMPT'))
            .getResponse();
    },
};

const FallbackHandler = {
    // The FallbackIntent can only be sent in those locales which support it,
    // so this handler will always be skipped in locales where it is not supported.
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('FALLBACK_MESSAGE'))
            .reprompt(requestAttributes.t('FALLBACK_REPROMPT'))
            .getResponse();
    },
};

const ExitHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
                || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('STOP_MESSAGE'))
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        console.log(`Error stack: ${error.stack}`);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('ERROR_MESSAGE'))
            .reprompt(requestAttributes.t('ERROR_MESSAGE'))
            .getResponse();
    },
};

const LocalizationInterceptor = {
    process(handlerInput) {
        // Gets the locale from the request and initializes i18next.
        const localizationClient = i18n.init({
            lng: handlerInput.requestEnvelope.request.locale,
            resources: languageStrings,
            returnObjects: true
        });
        // Creates a localize function to support arguments.
        localizationClient.localize = function localize() {
            // gets arguments through and passes them to
            // i18next using sprintf to replace string placeholders
            // with arguments.
            const args = arguments;
            const value = i18n.t(...args);
            // If an array is used then a random value is selected
            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            }
            return value;
        };
        // this gets the request attributes and save the localize function inside
        // it to be used in a handler by calling requestAttributes.t(STRING_ID, [args...])
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function translate(...args) {
            return localizationClient.localize(...args);
        }
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        GetWeatherHandler,
        HelpHandler,
        ExitHandler,
        FallbackHandler,
        SessionEndedRequestHandler,
    )
    .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor
    )
    .addResponseInterceptors(
        LoggingResponseInterceptor
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();