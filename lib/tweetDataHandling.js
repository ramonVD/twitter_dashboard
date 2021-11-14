/*Searches for name, username (different, first is display name), and description
of the tweet by looking up its author_id in the userlist*/
export function findTweetUserData(tweetsData, author_id) {
    //These properties are where the correlation with author_id is found
    if (!tweetsData.hasOwnProperty("includes") || !tweetsData["includes"].hasOwnProperty("users")) { return {}; }

    return find_dict_in_array_of_dicts(tweetsData["includes"]["users"], "id", author_id);
}

/*Returns the "important" values of the tweet, like its full text... (WIP)*/
export function getTweetData(tweetsData, tweetID) {
    if (!tweetsData.hasOwnProperty("data")) { return {}; }

    return find_dict_in_array_of_dicts(tweetsData["data"], "id", tweetID);
}

export function getTweetPayload_small(tweetData) {

} 

export function getTweetPayload_full(tweetData) {
    
} 

/*INFO TO WORK WITH: 
SI TE dins de data la key "in_reply_to_user_id", vol dir k no es retweet (o fes regex)

SI ES UN RETWEET, TROBES EL TEXT a la key includes al mateix lloc k data,
a la posicio de l'array principal igual que la que te el tweet a data,
i pot contenir imatges i urls al seu propi apartat entities

SI TE la key attachments, dins d'akesta la key media_keys. 
Akesta és una array amb valors que es corresponen amb el valor de la key
media_key d'una imatge. 
Aquest llistat d'imatges son a una key al mateix nivell ke data, ke es diu meta.
*/

/*Aux function to look for a dict in an array of dicts that has a property with the desired value*/
function find_dict_in_array_of_dicts(array_of_dicts, propertyName, searched_value) {
    for (let dict of array_of_dicts) {
        if (dict.hasOwnProperty(propertyName)) {
            if (dict[propertyName] == searched_value) {
                return dict;
            }
        }
    }
    return {};
}


/*From a string like 2021-11-13T16:04:47.000Z, return month, date, year and time
in an easier way to show to users and separated in chunks. diff langs but no
timezones? Also there's a function to format date internationally maybe in the future*/
export function cleanTweetDate(tweetDate, lang="en") {
    const monthsStrByLang = {
        "en": ["Jan", "Feb", "Mar", "Apr", "May", "June",
            "July", "Aug", "Sep", "Oct", "Nov", "Dec"
            ],
    "es": ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ago", "Set", "Oct", "Nov", "Dic"
            ]
    };
    if (!monthsStrByLang.hasOwnProperty(lang)) { lang = "en"; }

    const date = new Date(tweetDate);
    let dateString, timeString, PMorAM, seconds = undefined;
    if (!isNaN(date)) { //Not an invalid date
        dateString = date.toLocaleDateString().split("/");
        timeString = date.toLocaleTimeString().split(":");
        PMorAM = timeString[2].substring(2,5);
        seconds = timeString[2].substring(0,2);
    }
    return { 
        monthDay: dateString ? dateString[1] : "??",
        month: dateString ? monthsStrByLang[lang][parseInt(dateString[0]-1)] : "??",
        year: dateString ? dateString[2] : "??",
        hour: timeString ? timeString[0] : "??",
        min: timeString ? timeString[1] : "??",
        sec: timeString ? seconds : "??",
        PMorAM: timeString ? PMorAM : "PM"
    }

}