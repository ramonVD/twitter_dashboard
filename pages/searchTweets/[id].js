import { useRouter } from 'next/router'
import { useContext, useState, useEffect} from "react"
import pageNotFoundMsg from '../../components/utils/pageNotFoundMsg'
import {getTweetData, findTweetUserData} from "../../lib/tweetDataHandling"
import TweetContext from '../../components/global/tweetContext'
import { tweetWidget } from '../../components/tweets/displayedTweets'
import tweetInfoCard from '../../components/tweets/tweetInfoCard'
import Navbar from '../../components/shared/navbar'
import Link from "next/link"

/*Handles dynamic routing of found tweets, if the user clicks on a tweet
he gets this page with all its info (need to add more and ask for more in the API).
Maybe it will change, but so far it loads a tweet html through the twitter
api and populates its elements with a twitter script.

TO-DO: Decide if we're showing extra stuff for tweets (Iunno what yet),
improve the css of the shown stuff a loooot.*/
export default function TweetDisplay() {

    const router = useRouter();
    //Id of the selected tweet
    const { id } = router.query;

    //All saved tweets
    const {tweetResults, setTweetResults} = useContext(TweetContext);

    if (tweetResults == undefined) { 
        return pageNotFoundMsg("Tweet not found", "↲ Search results","/searchTweets");
    }

    const tweetData = getTweetData(tweetResults, id);
    if (Object.entries(tweetData).length == 0) {
        return pageNotFoundMsg("Tweet not found", "↲ Search results" ,"/searchTweets");
    }
    const author_data = findTweetUserData(tweetResults, tweetData["author_id"]);
    
    const [showingTweetInfo, setShowingTweetInfo] = useState(false);
    const [embeddedTweet, setEmbeddedTweet] = useState(undefined);

    useEffect(() => {
        getEmbeddedTweet(id, author_data["username"], setEmbeddedTweet);
        return () => {
            cleanGarbageTags();
        }
    }, [])

    let showCardClasses = "transition-all";
    showCardClasses += (showingTweetInfo) ? " block" : " hidden"
    return (
        <div className="flex flex-col flex-1 w-full h-full">
            {Navbar()}
            <div className="flex md:flex-row flex-col items-center">
                <div className="flex md:w-1/3 justify-center flex-col self-center md:self-start md:sticky md:top-44 lg:mx-12">
                    <div className="flex flex-col flex-grow-0 px-5 py-3 mx-auto">
                        <button className="h-14 my-2 mx-1 xl:text-base lg:text-sm text-xs bg-green-500 hover:bg-green-400 text-white font-bold py-1 px-3 border-b-3 border-green-700 hover:border-green-500 rounded"
                            onClick={() => {setShowingTweetInfo(!showingTweetInfo);}}>
                        {!showingTweetInfo ? "Show more tweet info (WIP)" : "Hide Tweet info (WIP)"}
                        </button>
                        <div className={showCardClasses}>
                        {tweetInfoCard()}
                        </div>
                        <Link href="/searchTweets">
                            <button className="h-14 my-2 mx-1 xl:text-base lg:text-sm text-xs bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 border-b-3 border-red-700 hover:border-red-500 rounded">
                            {"↲ Back to search"}
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="flex text-center self-center justify-center py-2"> 
                    {tweetWidget(embeddedTweet, setEmbeddedTweet)}
                </div>
            </div>
        </div>
    )
}

/*Gets the html of a tweet to embed it in a page. Makes a call to 
the api endpoint with the desired tweet id and its author username
and then updates the state with it.*/
async function getEmbeddedTweet(tweetID, author, setEmbeddedTweet) {

		const tweetUrl = `/api/getEmbeddedTweet?id=${tweetID}&author=${author}`;

		const embedded_code = await fetch(tweetUrl)
			.then(res => res.json())
			.then(data => {
				if (!data.hasOwnProperty("html")) { 
					//Incorrect data structure or error when retrieving
					return <div>{"Error loading tweet"}</div>;
				} //Maybe add custom errors via checking the error key in the data
                /*const endingPos = getElementPos(data["html"], /<\/blockquote>/);
                const wordLen = "</blockquote>".length
                THIS WAS from before I learned that you can use omit_script=true in the api call*/
                setEmbeddedTweet(data["html"]);
			})
			.catch(err => {
				//NEEDS BETTER ERROR HANDLING
				console.log("EmbeddedGet: " + err);
                setEmbeddedTweet(undefined);
            })
}

/*Cleans all the garbage elements that are created by the twitter widget scripts.
Some of them are twitter analytics iframes and stuff.*/
function cleanGarbageTags() {
    const twitterIframes = document.querySelectorAll("iframe");
    for (let iframe of twitterIframes) { iframe.remove(); }
    const intrusiveScript = document.querySelector("[src^='https://platform.twitter.com/js/']");
    if (intrusiveScript !== undefined && intrusiveScript !== null) { intrusiveScript.remove(); }
}