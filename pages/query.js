import loginBar from "../components/shared/loginBar"
import footer from "../components/shared/footer"
import React, {useState} from "react"

const debug = false;

/*TO-DO: NEED TO ADD AN OPTIONS OBJECT TO EXECUTESEARCH 
WITH STUFF LIKE GET RETWEETS, USER IDs...etc (other metrics that can be used or not)
AND REFLECT CHANGES IN THE TWITTERQUERY API.

ALSO TO DEBUG JUST USE THE JSON FILE WITH OLD DATA IN PUBLIC/DUMMYDATA

CREATE A TWEET HANDLING UTILS FILE TO HANDLE MATCHING AN USER WITH ITS TWEETS
VIA THEIR IDS AND STUFF LIKE THAT
*/

export default function queryPage() {

	const [results, setResults] = useState([]);
	const [searchText, setSearchText] = useState("nft");
	const [isLoading, setLoading] = useState(false);

	//Number of cols should be dynamic depending on number of tweets
	let page;
	return (
		<div className="flex h-screen flex-col w-screen">
			{loginBar()}

			<main className="flex flex-col w-full h-full justify-center">
				<div className="flex w-full md:h-9/12 justify-center items-stretch">
					<div className="md:p-5 p-1 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 content-start">
						{isLoading ? <div className="col-span-2 row-start-1 row-end-4 place-self-end p-4">
										<div className="animate-spin rounded-full ml-5 h-16 w-16 border-b-2 border-blue-900"></div>
									</div> :
									wrapTweetsHTML(results)}
					</div>
				</div>
				<div className="flex w-full md:h-3/12 justify-center items-center">
					<input className="bg-gray-200 h-10 appearance-none border-2 border-gray-200 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-900"
					type="text" value={searchText} onChange={e => setSearchText(e.target.value)}>
					</input>
					<button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border border-gray-500 rounded"
					onClick={() => executeSearch(searchText, setLoading, setResults)}>{"Search"}</button>
				</div>
			</main>

			{footer(false)}
		</div>
	)
}

function wrapTweetsHTML(tweets) {
	//Need to add css to all these
	const containerClasses = "p-4"; //Here to reference easily
	const tweetTitleClasses = "";
	const tweetTextClasses = "text-lg";

	if (tweets == undefined || tweets == "" || tweets.length < 1) {
		return <div className={"col-span-2 row-start-1 row-end-4 ml-5 place-self-end"}><p className={tweetTextClasses}>{"No results"}</p></div>;
	}

	const tweetsHTML = tweets.map(tweet => {
		return (
			<div className={containerClasses} key={tweet.id}>
				<h3 className={tweetTitleClasses}>{"SHOULD PULL USER.ID OR NAME IN NEXT BATCHES"}</h3>
				<p className={tweetTextClasses}>{tweet.text}</p>
			</div>
		);
	});
	return tweetsHTML;
}

async function executeSearch(searched_text, updateLoading, updateResults) {


	//PROBABLY ADD HERE A "SEARCH BAR IS EMPTY" MSG IN INPUT BAR IF THIS HAPPENS,
	//OR ADD A RED OUTLINE TO THE INPUT ELEMENT ON ITS ONCHANGE
	if (searched_text == "") { updateResults([]); return; } 

	updateLoading(true);

	if (debug) {
		//standard query: `https://api.twitter.com/2/tweets/search/recent?query=nft`;
		const testResults = {
			"data":
				[
					{"id":"1458828815401369600",
					"text":"RT @ZoobdooNFT: \uD83E\uDD16 Introducing zDrone v1.0 Trading Bot Testnet! \uD83E\uDD16\n\nStart testing your automated bot trading strategies today, Round 1 Early…"},
					{"id":"1458828814998380553",
					"text":"RT @LargoCoin: https://t.co/ozLPni0Jp7\n\nAt the same time, some analysts suggest the current NFT trend might be not so positive as regarded.…"},
					{"id":"1458828814436519941","text":"RT @heliosarmy: @CryptooAdy We believe that #Space is for every one.\nWith #Helios\uD83D\uDC8E to the space and beyond. \nPlease review @missionhelios p…"},{"id":"1458828814331817984","text":"RT @HuntUpNFTs: EPIC DROP ALERT!\n@METAWALLS_bln takes #StreetArt into the #Metaverse\n\nAt 7pm UTC we go live with our first fractional #CoNF…"},{"id":"1458828813605822464","text":"RT @ScorchBeats: \uD83D\uDD25BURNING ALLERT\uD83D\uDD25\nI'm gonna burn this last edition of \n'Distorted reality'\nhttps://t.co/Gbwg0bSqQi\nIt's your last chance to…"},{"id":"1458828813576523776","text":"#Liquidchain $XLC #YieldFarm #YieldFarming #altcoinseason #GameFi #NFT #DeFi #SmartChain https://t.co/tgvt0DMMfW"},{"id":"1458828813387718662","text":"Check out my NFT listing on OpenSea! https://t.co/xZb08ndT86 via @opensea"},{"id":"1458828813262114818","text":"@eddiegangland Fo sho. Maybe they will even know what an NFT is. That will be a bonus. \uD83D\uDE0E"},{"id":"1458828813132251136","text":"RT @DeflyBall: \uD83D\uDE80\uD83D\uDD25 Stay Tuned for [AMA in 1 Hour] Deflyball x Satoshi Club\n\n\uD83C\uDF81 Total Reward: $500\n\uD83D\uDCC5 Date: November 8th, 2021\n\uD83D\uDD52Time: 3 PM UTC…"},{"id":"1458828813031198721","text":"Solana NFT Radar @solnftradar\nhttps://t.co/cvMaFyW08U\n\n今までちょいちょい見てたSOLのNFTプロジェクトが共有されてるコミュ。ゲームに特化したコミュとかどっかにないかな"}
				],
				"meta":{"newest_id":"1458828815401369600",
				"oldest_id":"1458828813031198721",
				"result_count":10,
				"next_token":"b26v89c19zqg8o3fpdv95zub2f27qmhw94iqb47nkage5"}
		}
		setTimeout(() => {
			updateResults(testResults["data"]);
			updateLoading(false);
		}, Math.random() * 5000);
	}
	else {

		/*-----------------------------------------------------
		NEED TO ENCODEURI AND SANITIZE USER INPUT BASICALLY!!!!!!!!!!!!!!!!!!!!!!!!!1111111111
		-------------------------------------------------------
		*/
		//SANITIZE SEARCHED_TEXT!!!!!!!!!!1111111111111111

		const finalUrl = `/api/twitterquery?q=${searched_text}`;

		const search_results = await fetch(finalUrl)
			.then(res => res.json())
			.then(data => {
				if (!data.hasOwnProperty("data")) { 
					updateResults([]); 
					updateLoading(false); 
					return;
				} //Maybe add custom errors via checking the error key in the data
				console.log("HERE", JSON.stringify(data));
				updateResults(data["data"]);
				updateLoading(false);
			})
			.catch(err => {
				//NEEDS BETTER ERROR HANDLING
				console.log("queryJSErr: " + err);
				updateLoading(false);}
				)

	}
}