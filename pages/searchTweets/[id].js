import { useRouter } from 'next/router'
import { useContext} from "react"
import pageNotFoundMsg from '../../components/utils/pageNotFoundMsg'
import {findTweetData, findTweetUserData} from "../../components/utils/tweetHandling"
import TweetContext from '../../components/shared/tweetContext'
import { bigTweet } from '../../components/shared/tweetDisplay'
import footer from "../../components/shared/footer"

/*Handles dynamic routing of found tweets, if the user clicks on a tweet
he gets this page with all its info (need to add more and ask for more in the API)*/
export default function TweetDisplay() {

    const router = useRouter();

    //Id of the selected tweet
    const { id } = router.query;
    //All saved tweets
    const {tweetResults} = useContext(TweetContext);

    if (tweetResults == undefined) { 
        return pageNotFoundMsg("Tweet not found", "↲ Search results","/searchTweets");
    }

    const tweetData = findTweetData(tweetResults, id);
    if (Object.entries(tweetData).length == 0) {
        return pageNotFoundMsg("Tweet not found", "↲ Search results" ,"/searchTweets");
    }
    const author_data = findTweetUserData(tweetResults, tweetData["author_id"]);

    //Add more stuff here in the future
    const tweet_payload = {
        author: author_data["name"],
        username: author_data["username"],
        description: author_data["description"],
        text: tweetData.text,
        replies: tweetData["public_metrics"]["reply_count"],
        retweets: tweetData["public_metrics"]["retweet_count"],
        likes: tweetData["public_metrics"]["like_count"]
     };
     
    return (
        <div>
            {bigTweet(tweet_payload)}
            {footer(false, "↲ Back to tweet list", "/searchTweets")}
        </div>
    )
}