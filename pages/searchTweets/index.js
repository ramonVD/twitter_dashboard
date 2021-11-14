import loginBar from "../../components/shared/loginBar"
import footer from "../../components/shared/footer"
import Link from "next/link"
import {useState, useEffect, useContext, useRef} from "react"
import TweetContext from "../../components/shared/tweetContext"
import { smallTweet } from "../../components/shared/displayedTweets"
import {findTweetUserData} from "../../lib/tweetDataHandling"
import dummyTweets from "../../public/dummyData/tweets"
import { valueInSessionStorage } from "../../lib/sessionStorageHandling"

/*TO-DO: 
NEED TO ADD AN OPTIONS OBJECT TO EXECUTESEARCH 
WITH STUFF LIKE GET RETWEETS, USER IDs...etc (other metrics that can be used or not)
AND REFLECT CHANGES IN THE TWITTERQUERY API. - maybe, probably not, probably
a fixed api call since its so iffy.

ALSO TO DEBUG JUST USE THE JSON FILE WITH OLD DATA IN PUBLIC/DUMMYDATA - Done

CREATE A TWEET HANDLING UTILS FILE TO HANDLE MATCHING AN USER WITH ITS TWEETS
VIA THEIR IDS AND STUFF LIKE THAT - Done

NEED TO ADD THE RETWEET NUMBER, ETC TO SMALL TWEETS TOO I GUESS... (in tweetDisplay)

PROBABLY BEFORE DB, CHECK THAT YOU GET EVERYTHING YOU NEED FROM THE API, SINCE THE
DATA NEEDS TO BE CATEGORIZED

NEED TO IMPLEMENT USER AUTH (THINK ABOUT DB TYPE OR AUTH w/e, WHAT SHOULD GO IN THERE ETC)

REMOVE TOGGLE TO ALLOW FOR TEST DATA USAGE WHEN EVERYTHING'S FINISHED. MAYBE
MAKE IT ONLY SHOW UP IN DEV MODE, NEED TO CHECK DOCS
*/


export default function queryPage() {
	/*NOTA: Aixo mho he trobat. Next (React en realitat) te problemes si el valor inicial del context de 
	tweetResults es un objecte complex. Per la hidration k primer posa les dades dakest arxiu i despres les 
	de _app on es el context, i com k son objectes i es pensa k son diferents sagobia mazo.
	Passa el mateix si ho fas amb useeffects i tal, recordar que els useffects van primer el dakest
	arxiu i despres el d'app. Requereix més testing, pero basicament eh un follong.*/

	const {tweetResults, setTweetResults, searchForTweetInitial} = useContext(TweetContext);

	//Starting value of search text comes from TweetContext, so we can link the page with a search text in place
	const [searchText, setSearchText] = useState(searchForTweetInitial);
	const [isLoading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [debugMode, setDebugMode] = useState(true);

	//Save searched tweets on unmount, just to sessionStorage not localStorage (closing the browser removes them)
	useEffect(() => {
		const savedTweets = valueInSessionStorage("savedTweets") || {};

		if (savedTweets !== undefined && Object.entries(savedTweets).length > 0 && Object.entries(tweetResults).length === 0) {
			setTweetResults(savedTweets);
		}

		return() => {
			window.sessionStorage.setItem("savedTweets", JSON.stringify(tweetResults));
		}
	}, [tweetResults]);


	//MAYBE ADD A RED OUTLINE TO THE INPUT ELEMENT ON ERROR
	return (

		<div className="flex h-screen flex-col w-screen">
			{loginBar()}

			<main className="flex flex-col flex-1 w-full h-full justify-start items-start">
				<section className="flex w-full justify-center items-center max-h-5/6">
					<div id="tweetsGrid" className="md:px-2 px-1 min-w-full grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid-flow-row content-start place-items-stretch">
						{isLoading ? <div className="col-span-full p-2 my-52 mx-auto">
										<div className="animate-spin rounded-full ml-6 h-24 w-24 border-b-2 border-gray-700 mb-3"></div>
										<div className="text-2xl text-gray-700 pt-3">{"Fetching data..."}</div>
									</div>
									: wrapTweetsHTML(tweetResults)}
					</div>
				</section>

				<section className="flex flex-wrap w-full h-full justify-center items-center">
						<div className="text-center">
							<p className="w-full mb-3">{errorMsg}</p>
							<input className="bg-coolGray-200 w-8/12 h-10 appearance-none border-2 border-white-500 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-900"
							type="text" value={searchText} onChange={e => setSearchText(e.target.value)}>
							</input>
							<button className="bg-gray-500 h-10 ml-1 hover:bg-gray-700 text-white font-bold py-2 px-4 border border-gray-500 rounded"
							onClick={() => executeSearch(searchText, setErrorMsg, setLoading, setTweetResults, debugMode)}>{"Search"}</button>
						</div>
						<div className="flex items-center justify-center w-full mb-12">
							<label htmlFor="toggleB" className="flex items-center cursor-pointer">
								<div className="relative my-2">
									<input type="checkbox" id="toggleB" className="sr-only" checked={!debugMode}
									onChange={() => {setDebugMode(!debugMode);}} />
									<div className="block bg-blue-200 w-14 h-8 rounded-full"></div>
									<div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
								</div>
								<div className="ml-3 text-gray-700 font-medium">
								{"(DEV) Fetch external data"}
								</div>
							</label>
						</div>
				</section>
				{footer(false)}
			</main>

		</div>
	)
}

function wrapTweetsHTML(tweetsData) {
	const errorDivClasses = "col-span-full mx-auto";
	const errorTextClasses = "text-2xl font-bold my-52";

	//ERRORS
	if (tweetsData === undefined || tweetsData === "" || Object.entries(tweetsData).length === 0) {
		return (<div className={errorDivClasses}><p className={errorTextClasses}>{"No results"}</p></div>);
	}
	if (!tweetsData.hasOwnProperty("data") || !tweetsData["data"][0].hasOwnProperty("author_id")) { 
		return (<div className={errorDivClasses}><p className={errorTextClasses}>{"Error when retrieving data"}</p></div>);
	}

	const tweetsHTML = tweetsData["data"].map(tweet => {
		const author_id = tweet["author_id"];
		const {username, name} = findTweetUserData(tweetsData, author_id);
		return (
			<Link href={`/searchTweets/${tweet["id"]}`} key={tweet.id}>
				{smallTweet({
					username: username, name:name,
					text:tweet.text, 
					isRT: tweet.in_reply_to_user_id,
					created_at: tweet.created_at,
					public_metrics: tweet.public_metrics,
					lang: tweet.lang})}
			</Link>
		);
	});
	return tweetsHTML;
}

async function executeSearch(searched_text, updateErrors, updateLoading, updateResults, debugMode=false) {

	console.log("executing search");
	if (searched_text == "" && !debugMode) { 
		updateErrors("Search bar is empty. Input a name or a phrase to search");
		return;
	} else if (searched_text.length < 3 && !debugMode) {
		updateErrors("Search query has to have three letters at least.");
		return;	
	}


	/*-----------------------------------------------------
	ANY MORE SANITIZING OF USER INPUT?
	-------------------------------------------------------
	*/
	searched_text = encodeURI(searched_text);
	updateLoading(true);
	updateErrors("");

	if (debugMode) {
		const testResults = dummyTweets[parseInt(Math.random()*dummyTweets.length)];
		setTimeout(() => {
			updateResults(testResults);
			updateLoading(false);
		}, Math.random() * 2000); //feign that it takes time to fetch
	}
	else {

		const finalUrl = `/api/searchTweetsQuery?q=${searched_text}`;

		const search_results = await fetch(finalUrl)
			.then(res => res.json())
			.then(data => {
				if (!data.hasOwnProperty("data")) { 
					//Incorrect data structure or error when retrieving
					updateErrors("Received incorrect data");
					updateLoading(false); 
					return;
				} //Maybe add custom errors via checking the error key in the data
				console.log("THE DATA: ", JSON.stringify(data));
				updateResults(data);
				updateLoading(false);
			})
			.catch(err => {
				//NEEDS BETTER ERROR HANDLING
				updateErrors("Connection error. Check your connection status");
				console.log("queryJSErr: " + err);
				updateLoading(false);}
				)

	}
}