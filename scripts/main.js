// Get an api key from dark sky:
// https://darksky.net/dev/register
const apiKey = '';

addGreeting((user, response) => {
    response.sendText('🌊 🤖');
    response.sendText('How can I help you with the weather?');
})

newScript()
    .dialog('start',(session, response) => {
        response.sendButtons()
            .text('Tell me a location or pick one:')
            .addButton('postback', 'New York', 'ny')
            .addButton('postback', 'San Francisco', 'sf')
            .send();
    })
    .intent.always('general', 'help', (session, response) => {
        response.sendButtons()
            .text('Powered by Dark Sky')
            .addButton('url', 'Dark Sky', 'https://darksky.net/poweredby/')
            .send();
    })
    .expect
        .button('ny', (session, response) => {
            // return the promise so that the next dialog is only called
            // when the promise completes
            return request(`https://api.darksky.net/forecast/${apiKey}/40.7128,-74.0059`)
                .then(JSON.parse)
                .then((weather) => {
                    response.sendText(`Forecast for New York: ${weather.currently.summary}`)
                })
                .catch(err => {
                    console.log(err);
                    response.sendText('I screwed up getting the forecast');
                });
        })
        .button('sf', (session, response) => {
            return request(`https://api.darksky.net/forecast/${apiKey}/37.7749,-122.4194`)
                .then(JSON.parse)
                .then((weather) => {
                    response.sendText(`Forecast for San Francsico: ${weather.currently.summary}`);
                })
                .catch(err => {
                    console.log(err);
                    response.sendText('I screwed up getting the forecast');
                });
        })
        .intent('locations', 'city', (session, response) => {
            // maybe run an api request against a geo api?
            response.sendText(`I forgot where ${session.intent.details.locations.city} is!`);
        })
        .intent('weather', (session, response) => {
            if (!session.intent.details.locations.city) {
                switch (session.intent.action) {
                    case 'rain':
                        return response.sendText(`Raining where?`);
                    case 'snow':
                        return response.sendText(`Snowing where?`);
                    case 'temperature':
                        return response.sendText(`Temperature where`);
                    default:
                        return response.sendText('Where do you want the weather for?');
                }
            }
            response.sendText(`I forgot where ${session.intent.details.locations.city} is!`);
        })
        .text((session, response) => {
            console.log(session.intent);
            response.sendText('I do not know that city, sad bot');
        })
    .dialog((session, response) => {
        // when the default
        response.goto('start');
    })
