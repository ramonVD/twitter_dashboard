/*Searches for name, username (different, first is display name), and description
of the tweet by looking up its author_id in the userlist*/
export function findTweetUserData(tweetsData, author_id) {
    //These properties are where the correlation with author_id is found
    if (!tweetsData.hasOwnProperty("includes") || !tweetsData["includes"].hasOwnProperty("users")) { return {}; }

    return find_dict_in_array_of_dicts(tweetsData["includes"]["users"], "id", author_id);
}

/*Same as the first one but just gets the dict with the data property of 
the tweet with the chosen id*/
export function findTweetData(tweetsData, tweetID) {
    if (!tweetsData.hasOwnProperty("data")) { return {}; }

    return find_dict_in_array_of_dicts(tweetsData["data"], "id", tweetID);
}


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