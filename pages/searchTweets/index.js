import loginBar from "../../components/shared/loginBar"
import footer from "../../components/shared/footer"
import Link from "next/link"
import {useState, useEffect, useContext} from "react"
import TweetContext from "../../components/shared/tweetContext"
import { smallTweet } from "../../components/shared/tweetDisplay"
import {findTweetUserData} from "../../components/utils/tweetHandling"
import dummyTweets from "../../public/dummyData/tweets"

const debug = true;

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

*/


export default function queryPage() {

	const {tweetResults, setTweetResults} = useContext(TweetContext);

	//Save searched tweets on unmount, just to sessionStorage not localStorage (closing the browser removes them)
	useEffect(() => {
		let savedTweets = window.sessionStorage.getItem("savedTweets");
		try {
			savedTweets = JSON.parse(savedTweets);
		} catch {
			savedTweets = {};
		}

		if (savedTweets !== null && Object.entries(savedTweets).length > 0 && Object.entries(tweetResults).length == 0) {
			setTweetResults(savedTweets);
		}

		return() => {
			window.sessionStorage.setItem("savedTweets", JSON.stringify(tweetResults));
		}
	}, [tweetResults]);

	const [searchText, setSearchText] = useState("");
	const [isLoading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	//MAYBE ADD A RED OUTLINE TO THE INPUT ELEMENT ON ERROR
	return (
		<div className="flex h-screen flex-col w-screen">
			{loginBar()}

			<main className="flex flex-col flex-1 w-full h-full justify-start items-start">
				<section className="flex w-full justify-center items-center max-h-5/6">
					<div id="tweetsGrid" className="md:px-5 px-1 grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 grid-flow-row content-start place-items-stretch">
						{isLoading ? <div className="col-span-4 row-start-1 row-end-4 place-self-end p-4 my-52">
										<div className="animate-spin rounded-full ml-5 h-24 w-24 border-b-2 border-blue-900"></div>
									</div> 
									:
									wrapTweetsHTML(tweetResults)}
					</div>
				</section>

				<section className="flex flex-wrap w-full h-full justify-center items-center">
						<div className="text-center">
							<p className="w-full mb-5">{errorMsg}</p>
							<input className="bg-coolGray-200 h-10 mr-2 appearance-none border-2 border-white-500 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-900"
							type="text" value={searchText} onChange={e => setSearchText(e.target.value)}>
							</input>
							<button className="bg-gray-500 h-10 hover:bg-gray-700 text-white font-bold py-2 px-4 border border-gray-500 rounded"
							onClick={() => executeSearch(searchText, setErrorMsg, setLoading, setTweetResults)}>{"Search"}</button>
						</div>
				</section>
				{footer(false)}
			</main>

		</div>
	)
}

function wrapTweetsHTML(tweetsData) {
	
	const errorDivClasses = "col-span-4 row-start-1 row-end-4 ";
	const errorTextClasses = "text-2xl font-bold my-52";

	//ERRORS
	if (tweetsData == undefined || tweetsData == "" || Object.entries(tweetsData).length == 0) {
		return <div className={errorDivClasses}><p className={errorTextClasses}>{"No results"}</p></div>;
	}
	if (!tweetsData.hasOwnProperty("data") || !tweetsData["data"][0].hasOwnProperty("author_id")) { 
		return <div className={errorDivClasses}><p className={errorTextClasses}>{"Error when retrieving data"}</p></div>;
	}

	const tweetsHTML = tweetsData["data"].map(tweet => {
		const author_id = tweet["author_id"];
		const {username, name} = findTweetUserData(tweetsData, author_id);
		return (
			<Link href={`/searchTweets/${tweet["id"]}`} key={tweet.id}>
				{smallTweet({username: username, name:name, text:tweet.text})}
			</Link>
		);
	});
	return tweetsHTML;
}

async function executeSearch(searched_text, updateErrors, updateLoading, updateResults) {

	if (searched_text == "") { 
		updateErrors("Search bar is empty. Input a name or a phrase to search");
		return;
	}

	updateLoading(true);
	updateErrors("");

	if (debug) {
		const testResults = dummyTweets[parseInt(Math.random()*dummyTweets.length)];
		setTimeout(() => {
			updateResults(testResults);
			updateLoading(false);
		}, Math.random() * 2000); //feign that it takes time to fetch
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
					//Incorrect data structure or error when retrieving
					updateErrors("Received incorrect data");
					updateResults({}); 
					updateLoading(false); 
					return;
				} //Maybe add custom errors via checking the error key in the data
				console.log("THE DATA: ", JSON.stringify(data,undefined,2));
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