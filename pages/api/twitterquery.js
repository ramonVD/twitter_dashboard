/*
API Middleware that handles calling the twitter API to get info, uses 
a dev bearer token so far located in .env or .env.local.
Its format should be BEARER_TOKEN=....
It returns the requested twitter data in json format
*/
export default async function handler(req, res) {
    const token = process.env.BEARER_TOKEN;

    //Access the api via /api/twitterQuery?q=blahblah, q will be the text we search for
    const { q } = req.query;
    if (q == "") { res.status(500).json( {error: "No text to search for specified"}); } 

    try {
        const max_results = 10; //min is 10 tweets
        const url = 
        `https://api.twitter.com/2/tweets/search/recent?query=${q}&max_results=${max_results}&tweet.fields=public_metrics&expansions=author_id&user.fields=description`;
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
            console.error('TwitterQueryErr:', error);
            throw error;
        });
    } catch (err) {
        //NEEDS BETTER ERROR HANDLING 2
        res.status(500).json({ error: 'failed to load data' })
      }
  }
  