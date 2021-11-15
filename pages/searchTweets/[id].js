import { useRouter } from 'next/router'
import { useContext, useState, useEffect} from "react"
import pageNotFoundMsg from '../../components/utils/pageNotFoundMsg'
import {getTweetData, findTweetUserData} from "../../lib/tweetDataHandling"
import TweetContext from '../../components/shared/tweetContext'
import { tweetWidget } from '../../components/shared/displayedTweets'
import tweetInfoCard from '../../components/shared/tweetInfoCard'
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
    const {tweetResults} = useContext(TweetContext);

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

    /*Next te problemes carregant scripts que necessiten recarregar-se per pagina.
    Existeix alguna llibreria com npm-twitter-widgets(sic) que et fan la feina,
    pero el problema és que criden a llocs externs i paranoia.
    El problema amb usar scripts externs (com el cas dels k susen per poblar
    els atributs de l'html del tweet, esk a react no li mola k toquin el DOM
    sense que ell canvii d'estat.
    Per aixo recarrego lscript i el crido cada cop k trobo les dades k vull carregar.
    Basicament l'ordre seria: 
    Crida a l'api perk et doni l'html del tweet. 
    Escriu-lo a la pagina (evalua'l més bé, fotent al DOM lstring amb l'html via dangerouslySetInnerHTML)
    Un cop el tens escrit al DOM, executa la comanda de lscript per poblar l'html.
    La putada esk lscript, k normalment sexecutaria super rapid abans k shagues populat la pagina
    i tot (o podries executar trankilament amb events desprs de window load),
    per culpa de react no pots estar segur de quan posara al namespace la 
    comanda k cal executar al window del client, pel k la vaig intentant cridar cada x temps
    Aquestes dues ultimes coses es troben al tweetWidget a displayedTweets, 
     */

    useEffect(() => {
        getEmbeddedTweet(id, author_data["username"], setEmbeddedTweet);
        return () => {
            cleanGarbageTags();
        }
    }, [])

    let showCardClasses = "transition-all";
    showCardClasses += (showingTweetInfo) ? " block" : " hidden"
    //LScript esta tret de twitter a
    //https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/scripting-loading-and-initialization
    return (
            <div className="grid md:grid-cols-4 place-content-stretch">
                <div className="flex flex-initial justify-center items-stretch text-center py-2 md:col-span-2"> 
                    {tweetWidget(embeddedTweet)}
                </div>
                <div className="flex-col md:sticky flex flex-grow-0 md:self-start md:top-32 mx-auto content-stretch md:col-span-2">
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