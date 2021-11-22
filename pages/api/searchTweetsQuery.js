/*
API Middleware that handles calling the twitter API to get info, uses 
a dev bearer token so far located in .env or .env.local.
Its format should be BEARER_TOKEN=....
It returns the requested twitter data in json format
Need to use tweet_mode=extended to get full text of the tweet (THIS IN V1.0)
IN THE CURRENT V2.0, RETWEETS GET SHORTENED, GOTTA PULL MORE DATA TO FIX THIS
*/
export default async function handler(req, res) {
    const token = process.env.BEARER_TOKEN;

    //standard query is: `https://api.twitter.com/2/tweets/search/recent?query=nft`;
    //But we need more complex queries.

    //Access the api via /api/twitterQuery?q=blahblah, q will be the text we search for
    const { q } = req.query;
    if (q === "") { res.status(400).json( {error: "No text to search for specified"}); }

    const max_results = 10; //min is 10 tweets, change this in the future to be custom

    //Desglossed url to be easier to change
    //Query with all possible data. Needed to get the full text from RTs?
    /*
    const url = [
    `https://api.twitter.com/2/tweets/search/recent?query=${q}`,
    `&expansions=attachments.poll_ids,attachments.media_keys,author_id,entities.mentions.username,`,
    `geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id`,
    `&tweet.fields=attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,`,
    `in_reply_to_user_id,lang,possibly_sensitive,public_metrics,referenced_tweets,reply_settings,source,text,withheld`,
    `&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,`,
    `protected,public_metrics,url,username,verified,withheld`,
    `&place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type`,
    `&poll.fields=duration_minutes,end_datetime,id,options,voting_status`,
    `&media.fields=duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics,non_public_metrics,organic_metrics,promoted_metrics`,
    `&max_results=${max_results}`].join("");*/

    //Reduced the size of the search parameters, still tweaking
    const url = [`https://api.twitter.com/2/tweets/search/recent?query=${q}`,
    `&expansions=attachments.media_keys,author_id,entities.mentions.username`,
    `&tweet.fields=author_id,conversation_id,created_at,entities,public_metrics,text,lang`,
    `&user.fields=created_at,description,entities,id,location,name,profile_image_url,protected,public_metrics,url,username,verified`,
    `&media.fields=media_key,url`,
    `&max_results=${max_results}`].join("");

    const myHeaders = {
        'Authorization': `Bearer ${token}`
    };
    await fetch(url, {
        method: "GET",
        headers: myHeaders
    })
    .then(response => response.json())
    .then(data => {
        console.log("DATA", data);
        res.status(200).send(data)
    })
    .catch((error) => {
        //NEEDS BETTER ERROR HANDLING
        res.status(500).json({ error: ('Failed to load data', error) })
    });
  }
  