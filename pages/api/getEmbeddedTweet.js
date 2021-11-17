/*
API Middleware that handles calling the twitter API to get the html markup for a tweet.
Needs the original tweet id and its author USERNAME (the name after the @). No auth needed.
https://developer.twitter.com/en/docs/twitter-for-websites/oembed-api#Embedded
*/
export default async function handler(req, res) {

    const { id, author } = req.query;
    if (id === "" || author === "") { res.status(400).json( {error: "Invalid id or author"}); }

    try {
        
        //By default, omits the script to populate the widget
        const url = [
        `https://publish.twitter.com/oembed?url=https%3A%2F%2F`,
        `twitter.com%2F${author}%2Fstatus%2F${id}&omit_script=true&`
        ].join("");

        await fetch(url)
        .then(response => response.json())
        .then(data => {
            res.status(200).send(data)
        })
        .catch((error) => {
            //NEEDS BETTER ERROR HANDLING
            console.error('Embedded data error:', error);
            throw error;
        });
    } catch (err) {
        //NEEDS BETTER ERROR HANDLING 2
        res.status(500).json({ error: 'failed to load embedded tweet data' })
      }
  }