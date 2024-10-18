// import { ticketMasterApi } from "./apiConfig.js";
// const apiKey = ticketMasterApi.TM_API_KEY;
// // console.log(apiKey);
// const url = `https://app.ticketmaster.com/discovery/v2/events.json`; 

// axios.get(url, {
//     params: {
//         apikey: apiKey,
//         countryCode: 'DE',
//         size: 50, 
//     }
// })
//     .then((res) => {
//         const events = res.data._embedded.events;
//         console.log(events);
//         events.forEach(event => {
//             console.log(`Event Name: ${event.name}`);
//             console.log(`Event Date: ${event.dates.start.localDate}`);
//             console.log(`Venue: ${event._embedded.venues[0].name}`);
//             console.log('-----------------------------');
//         });
//     })
//     .catch((err) => {
//         console.error(err);
//     });


// const URL = 'https://www.eventbriteapi.com/v3/events/search';
// axios.get(URL, {
//     headers: {
//         'Authorization': `Bearer ${TOKEN}`
//     },
//     params: {    
//     }
// })
//     .then(response => {
//         console.log(response.data.events);
//     })
//     .catch( error => {
//         console.error(error);
//     });c

