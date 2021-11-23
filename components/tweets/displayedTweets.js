import { useEffect } from "react";
import {cleanTweetDate} from "../../lib/tweetDataHandling"
import footer from "../shared/footer"
import Spinner from "../shared/spinner"

const containerClasses = "sm:p-3 p-2 m-1 border rounded border-blue-200 hover:bg-blue-100 cursor-pointer relative"; //Here to reference easily
const tweetTitleClasses = "md:text-lg text-medium font-bold md:w-full";
const tweetTextClasses = "lg:text-base sm:text-sm text-xs md:mx-auto max-w-full min-w-0 overflow-ellipsis break-words mb-8";

/*Small tweet element, for when we're listing a lot of them*/
export function SmallTweet(tweetParams) {
    const dateObj = cleanTweetDate(tweetParams.created_at);
    return (
        <div className={containerClasses}>
            <div className="md:mb-3 mb-1 break-all">
            <h3 className={tweetTitleClasses}>{tweetParams.name || "???"} 
                <span className="text-xs align-middle font-light align-top">{`⠀@${tweetParams.username}` || "@???"}</span>
            </h3>
            </div>
            <div className={tweetTextClasses}>{tweetParams.text}</div>
            <div className="text-xs italic font-light absolute bottom-3 left-3">
                    {`${dateObj.month} ${dateObj.monthDay} - ${dateObj.hour}:${dateObj.min} ${dateObj.PMorAM}`}
            </div>
        </div>
    );
}