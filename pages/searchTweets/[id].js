import { useRouter } from 'next/router'
import { useContext, useState, useEffect} from "react"
import PageNotFoundMsg from '../../components/utils/pageNotFoundMsg'
import TweetContext from '../../components/global/tweetContext'
import TweetInfoCard from '../../components/tweets/tweetInfoCard'
import Navbar from '../../components/shared/navbar'
import Spinner from '../../components/shared/spinner'
import Link from "next/link"

/*Handles dynamic routing of found tweets, if the user clicks on a tweet
he gets this page with all its info.
Maybe it will change, but so far it loads a tweet html through the twitter
api and populates its elements with a twitter script.*/
export default function TweetDisplay() {

    const router = useRouter();
    //Id of the selected tweet
    const { id } = router.query;

        
    const [showingTweetInfo, setShowingTweetInfo] = useState(false);
    const [loading, setLoading] = useState(true);
    
    //All saved tweets
    const {tweetResults} = useContext(TweetContext);

    useEffect(() => {
        const tweetWidth = window.innerWidth > 550 ? 520 : Math.max(250, (window.innerWidth - 40));
        getEmbeddedTweet(id, tweetWidth, window.twttr, setLoading);

        return () => {
            cleanGarbageTags();
        }
    }, [id])
    let showCardClasses = "transition-all";
    showCardClasses += (showingTweetInfo) ? " block" : " hidden"
    /*Note: that tweetResults exists is not needed. However, since the script is loaded when accessing
    through the previous page, this makes it so they have to load that page before accessing the tweet.
    Probably change the way this works, load script every time dynamic routing goes off?*/
    if (tweetResults === undefined || Object.entries(tweetResults).length === 0) { 
        return PageNotFoundMsg("Tweet not found", "↲ Search results","/searchTweets");
    } else {
        return (
            <div className="flex flex-col flex-1 w-full h-full">
                {Navbar()}
                <div className="flex md:flex-row flex-col justify-start">
                    <div className="flex md:w-1/3 justify-center flex-col self-center md:self-start md:sticky md:top-44 lg:mx-12">
                        <div className="flex flex-col flex-grow-0 px-5 pt-3 mx-auto">
                            <button className="h-14 my-2 mx-1 xl:text-base lg:text-sm text-xs bg-green-500 hover:bg-green-400 text-white font-bold py-1 px-3 border-b-3 border-green-700 hover:border-green-500 rounded"
                                onClick={() => {setShowingTweetInfo(!showingTweetInfo);}}>
                            {!showingTweetInfo ? "Show more tweet info (WIP)" : "Hide Tweet info (WIP)"}
                            </button>
                            <div className={showCardClasses}>
                            {TweetInfoCard()}
                            </div>
                            <Link href="/searchTweets" passHref>
                                <button className="h-14 my-2 mx-1 xl:text-base lg:text-sm text-xs bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 border-b-3 border-red-700 hover:border-red-500 rounded">
                                {"↲ Back to search"}
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex self-center justify-center py-2 text-center"> 
                        <div className="mt-5" id="tweet-container"></div>
                        {loading && Spinner("","animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600 mt-52 mx-24 ml-16",
                            "mb-52 mt-5 text-3xl text-blue-600", "Loading tweet...")}
                        {loading === undefined && <div className="text-center mt-52">
                                                    <p className="text-2xl font-bold">Whoops</p>
                                                    <p className="text-lg font-bold">This tweet was removed</p>
                                                </div>}
                    </div>
                </div>
            </div>
        )}
}

/*Creates the twitter widget calling the widget.js script with the tweet id.
https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-parameter-reference
Note: the width property wasnt updating iframe width and it was defaulting to the smallest size,
so now when the tweet iframe is generated it changes its size to the optimal for the corresponding window size.
It's not a responsive solution but resizing it again is just one click away...*/
async function getEmbeddedTweet(tweetID, width, twttrObject, setLoading) {
        if (twttrObject === null || twttrObject === undefined) { return }
            twttrObject.widgets.createTweet(
                tweetID,
                document.getElementById("tweet-container"),
                {
                  width: width,
                  align:"center",
                }
              ).then(() => {
                  setLoading(false); 
                  document.querySelector("#tweet-container iframe").style.width = width + "px";
              }).catch(() => {setLoading(undefined)});
}

/*Cleans all the garbage elements that are created by the twitter widget scripts.
Some of them are twitter analytics iframes and stuff.*/
function cleanGarbageTags() {
    const twitterIframes = document.querySelectorAll("iframe");
    for (let iframe of twitterIframes) { iframe.remove(); }
    const intrusiveScript = document.querySelector("[src^='https://platform.twitter.com/js/']");
    if (intrusiveScript !== undefined && intrusiveScript !== null) { intrusiveScript.remove(); }
}