import { useEffect } from "react";
import {cleanTweetDate} from "../../lib/tweetDataHandling"
import footer from "../shared/footer"

const containerClasses = "md:p-4 sm:p-2 p-1 sm:m-2 m-1 border rounded border-blue-200 hover:bg-blue-100 cursor-pointer relative"; //Here to reference easily
const tweetTitleClasses = "md:text-xl text-lg font-bold md:w-full";
const tweetTextClasses = "lg:text-xl md:text-lg sm:text-base text-sm md:mx-auto max-w-full min-w-0 overflow-ellipsis break-words mb-8";

/*Small tweet element, for when we're listing a lot of them*/
export function smallTweet(tweetParams) {
    const dateObj = cleanTweetDate(tweetParams.created_at);
    return (
        <div className={containerClasses}>
            <div className="md:mb-3 mb-1">
            <h3 className={tweetTitleClasses}>{tweetParams.name || "???"} 
                <span className="text-sm align-middle font-light align-top">{`⠀@${tweetParams.username}` || "@???"}</span>
            </h3>
            </div>
            <div className={tweetTextClasses}>{tweetParams.text}</div>
            <div className="sm:text-sm text-xs italic font-light absolute bottom-3 md:left-4 sm:left-2 left-1">
                    {`${dateObj.month} ${dateObj.monthDay} - ${dateObj.hour}:${dateObj.min} ${dateObj.PMorAM}`}
            </div>
        </div>
    );
}

/*Sets the html frame for a tweet widget and executes the script
to populate it correctly.*/
export function tweetWidget(tweetData) {
    /*Since react isnt gonna reliably tell us when the dom has loaded
    correctly, this is an interval that auto stops when it succeeds
    loading the script to populate the html.
    It gets removed on unmount just in case*/
    useEffect(() => {
        var populateInterval = setInterval(function() {
            if ( window.twttr !== undefined) {
                if (window.twttr.widgets !== undefined) {
                    window.twttr.widgets.load();
                    clearInterval(populateInterval);
                }
            }
        }, 50); 
        return () => {
            clearInterval(populateInterval);
        }
    }
    );
    if (tweetData === undefined) {
        return (
            <div>
                <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600 mt-52 mx-14"></div>
                <div className="mb-52 mt-5 text-3xl text-blue-600">{"Loading tweet..."}</div>
            </div>)
    } else {
  
        return (
            <div dangerouslySetInnerHTML={{__html: tweetData}} />);
    }
}






/*UNUSED SO FAR, USING TWITTER WIDGET...*/
//Need to decorate this right
/*    
UNUSED STYLES THAT WILL BE USED:
al div amb el tweetdata.text
    <img className=tweet-img-wrap ... /> per una imatge dins el tweet
*/
export function bigTweet(tweetParams) {
    const dateObj = cleanTweetDate(tweetParams.created_at);
    return (
        <div>
        <div className="tweet-wrap">
            <div className="tweet-header">
                <img src={tweetParams.profile_img} alt="tweet img" className="avator" />
                <div className="tweet-header-info">
                {tweetParams.author} <span>{`@${tweetParams.username}⠀`}</span>
                    <span className="text-blue-800">{`-⠀${dateObj.month} ${dateObj.monthDay}`}</span>
                    <p>{tweetParams.description || "No description in bio"}</p>
                </div>
            </div>
            <div className="text-2xl m-5">
                {tweetParams.text}
            </div>
            <div className="tweet-info-counts">
                
                <div className="comments">
                
                <svg className="feather feather-message-circle sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <div className="comment-count">{tweetParams.replies}</div>
                </div>
                
                <div className="retweets">
                <svg className="feather feather-repeat sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                <div className="retweet-count">{tweetParams.retweets}</div>
                </div>
                
                <div className="likes">
                <svg className="feather feather-heart sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <div className="likes-count">{tweetParams.likes}</div>
                </div>
                
                <div className="message">
                <svg className="feather feather-send sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </div>
            </div>
        </div>
        {footer(false, "↲ Back to tweet list", "/searchTweets", "flex flex-row w-full h-full items-start my-3")}
    </div>
    )
}