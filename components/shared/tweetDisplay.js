
const containerClasses = "sm:p-4 p-1 sm:m-2 m-1 border rounded border-blue-200 hover:bg-blue-100 cursor-pointer flex flex-col flex-wrap flex-grow justify-start"; //Here to reference easily
const tweetTitleClasses = "text-xl font-bold md:w-full";
const tweetTextClasses = "lg:text-xl nd:text-lg text-base md:mx-auto max-w-full min-w-0 overflow-ellipsis break-words";

/*Small tweet element, for when we're listing a lot of them*/
export function smallTweet(tweetParams) {
    return (
        <div className={containerClasses}>
            <div className="mb-3">
            <h3 className={tweetTitleClasses}>{tweetParams.name || "???"}</h3>
            <small className="-mt-2">{tweetParams.username || "???"}</small></div>
            <p className={tweetTextClasses}>{tweetParams.text}</p>
        </div>
    );
}

/*Big tweet, when its the only thing on a page, or change this w/e...*/
//Need to decorate this right
/*        <link href="https://fonts.googleapis.com/css?family=Asap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
Potser afegir-ho via el modul de css

UNUSED STYLES THAT WILL BE USED:
a tweet-header-info, la foto de la profile
<img src={`"https://pbs.twimg.com/profile_images/${id}/bYSITKz2_400x400.jpg"`} alt="" className="avator" />

al div amb el tweetdata.text
    <img className=tweet-img-wrap ... /> per una imatge dins el tweet
*/
export function bigTweet(tweetParams) {
    return (
    <div className="tweet-wrap">
        <div className="tweet-header">
            <div className="tweet-header-info">
            {tweetParams.author} <span>{tweetParams.username}</span><span>. Jun 69</span>
                <p>{tweetParams.description}</p>
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
    )
}