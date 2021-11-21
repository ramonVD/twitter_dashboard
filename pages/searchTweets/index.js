import Navbar from "../../components/shared/navbar"
import Footer from "../../components/shared/footer"
import Link from "next/link"
import {useState, useContext} from "react"
import TweetContext from "../../components/global/tweetContext"
import {findTweetUserData} from "../../lib/tweetDataHandling"
import { SmallTweet } from "../../components/tweets/displayedTweets"
import Spinner from "../../components/shared/spinner"
import Toggle from "../../components/shared/toggle"
import WidgetScript from "../../components/global/tweetWidgetScript"

/*TO-DO: 

NEED TO ADD THE RETWEET NUMBER, ETC TO SMALL TWEETS TOO I GUESS... (in tweetDisplay)

REMOVE TOGGLE TO ALLOW FOR TEST DATA USAGE WHEN EVERYTHING'S FINISHED. MAYBE
MAKE IT ONLY SHOW UP IN DEV MODE, NEED TO CHECK DOCS
*/

const dummyTweets = require("../../data/tweets.json");

export default function QueryPage() {
	/*Old values of seen tweets are saved in the context, decided to remove this from sessionStorage (it does
		exactly the same thing as if we saved it in sessionStorage. If we move them to localStorage (why tho) 
		remove these from context and hook em up to localStorage on useEffect)*/
	const {tweetResults, setTweetResults, searchForTweetInitial} = useContext(TweetContext);

	//Starting value of search text comes from TweetContext, so we can link the page with a search text in place
	const [searchText, setSearchText] = useState(searchForTweetInitial);
	const [isLoading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState({user: "", query: ""});
	const [debugMode, setDebugMode] = useState(true);


	return (

		<div className="flex h-screen flex-col w-screen">
        	{WidgetScript()}
			{Navbar()}

			<main className="flex flex-col flex-1 w-full h-full justify-start items-start">
				<section className="flex w-full justify-center items-center max-h-5/6 pt-1">
					<div id="tweetsGrid" className="md:px-2 px-1 min-w-full grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid-flow-row content-start place-items-stretch">
						{isLoading ? Spinner("col-span-full p-2 my-52 mx-auto", 
											"animate-spin rounded-full ml-6 h-24 w-24 border-b-2 border-gray-700 mb-3",
											"text-2xl text-gray-700 pt-3", "Fetching data...")
									: wrapTweetsHTML(tweetResults, errorMsg)}
					</div>
				</section>

				<section className="flex flex-wrap w-full h-full justify-center items-center">
						<div className="text-center">
							<p className="w-full mb-3">{errorMsg.user}</p>
							<input className={ (errorMsg.user === "" ? " border-white-500 " : " border-red-500 ") + 
							"bg-coolGray-200 w-8/12 h-10 appearance-none border-2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-900"}
							type="text" value={searchText} onChange={e => setSearchText(e.target.value)}>
							</input>
							<button className="bg-gray-500 h-10 ml-1 hover:bg-gray-700 text-white font-bold py-2 px-4 border border-gray-500 rounded"
							onClick={() => executeSearch(searchText, setErrorMsg,
										 setLoading, setTweetResults, debugMode)}>{"Search"}</button>
						</div>
						<div className="flex items-center justify-center w-full mb-12">
							{Toggle(debugMode, setDebugMode, "(DEV) Fetch external data")}
						</div>
				</section>
				{Footer(false)}
			</main>

		</div>
	)
}

function wrapTweetsHTML(tweetsData, errorMsg) {
	const errorDivClasses = "col-span-full mx-auto";
	const errorTextClasses = "text-2xl font-bold my-52";

	//ERRORS
	if (errorMsg.query !== undefined && errorMsg.query !== "") {
		return (<div className={errorDivClasses}><p className={errorTextClasses}>{errorMsg.query}</p></div>);
	}
	else if (tweetsData === undefined || tweetsData === "" || Object.entries(tweetsData).length === 0) {
		return (<div className={errorDivClasses}><p className={errorTextClasses}>{"No results"}</p></div>);
	}
	else if (!tweetsData.hasOwnProperty("data") || !tweetsData["data"][0].hasOwnProperty("author_id")) { 
		return (<div className={errorDivClasses}><p className={errorTextClasses}>{"Error when retrieving data"}</p></div>);
	}

	const tweetsHTML = tweetsData["data"].map(tweet => {
		const author_id = tweet["author_id"];
		const {username, name} = findTweetUserData(tweetsData, author_id);
		return (
			<Link href={`/searchTweets/${tweet["id"]}`} key={tweet.id}>
				{SmallTweet({
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

	if (searched_text == "" && !debugMode) { 
		updateErrors({user: "Search bar is empty. Input a name or a phrase to search"});
		return;
	} else if (searched_text.length < 3 && !debugMode) {
		updateErrors({user: "Search query has to have three letters at least."});
		return;	
	}


	/*-----------------------------------------------------
	Removes most special characters (not ç or accents), twitter api should be secure enough.

	Twitter apparently has problems with ç's and accents. When searching on the website they
	work though. Need to research this further
	-------------------------------------------------------
	*/

	searched_text =  encodeURIComponent(searched_text).replace(/[.!~*'()]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
	searched_text = Buffer.from(searched_text, 'utf-8').toString();

	setErrorAndLoadingMsg(updateErrors, {user:"", query:""}, updateLoading, true);

	if (debugMode) {
		const testResults = dummyTweets[parseInt(Math.floor(Math.random()*(dummyTweets.length)))];
		setTimeout(() => {
			updateResults(testResults);
			updateLoading(false);
		}, Math.random() * 1000 ); //feign that it takes time to fetch
	}
	else {

		const finalUrl = `/api/searchTweetsQuery?q=${searched_text}`;

		const search_results = await fetch(finalUrl)
			.then(res => res.json())
			.then(data => {
				if (data === undefined) {
					setErrorAndLoadingMsg(updateErrors, {user:"Please type a different query", query:"Invalid query"}, updateLoading);
					return;
				}
				if (!data.hasOwnProperty("data")) { 
					console.log("here");
					console.log(data);
					if (data.hasOwnProperty("meta") && data["meta"].result_count === 0){
						setErrorAndLoadingMsg(updateErrors, {user:"Please type a different query", query:"Query yielded no results"}, updateLoading);
					} else {
					//Incorrect data structure
					setErrorAndLoadingMsg(updateErrors, {user:"", query: data.error.message.substring(0,26)}, updateLoading);
					}
					return;
				} //Maybe add custom errors via checking the error key in the data
				console.log("THE DATA: ", JSON.stringify(data));
				updateResults(data);
				updateLoading(false);
			})
			.catch(err => {
				console.log(err);
				setErrorAndLoadingMsg(updateErrors, {user:"Connection problems. Unable to send query"}, updateLoading)
			})
		}
}

/*Aux function to update both error and loading state, exists because both things happen together a lot*/
function setErrorAndLoadingMsg(updateErrors, errorMsg, updateLoading,loadingStatus=false) {
	updateErrors(errorMsg);
	updateLoading(loadingStatus);
}