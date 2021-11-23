/*
API Middleware that handles calling the telegram bot API to deliver a message
to a chat.

It returns a success json object with the msg data on successful delivery. Else we get...

*/
export default async function handler(req, res) {
    const botToken = process.env.BOT_TOKEN;
    const chatID = process.env.CHAT_ID;

    const { msg } = req.query;
    //Improve this
    if (msg === "" || msg === undefined ) { res.status(400).json( {error: "No message for the bot to display"}); }
    if (chatID === undefined) { res.status(400).json( {error: "No chat ID specified"}); }
    if (botToken === undefined) { res.status(400).json( {error: "No bot token specified"}); }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatID}&parse_mode=Markdown&text=${msg}`

    await fetch(url, {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        res.status(200).send({success: true, data: data})
    })
    .catch((error) => {
        //NEEDS BETTER ERROR HANDLING
        res.status(500).json({ success: false, error: ('Error sending data', error) })
    });
  }
  