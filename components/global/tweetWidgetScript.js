import Script from "next/script"

/*Twitter script for populating a tweet html widget with their custom css/interactivity.
Initialized when tweets search page is loaded. Their functions are manually called when needed.
Taken from: https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/scripting-loading-and-initialization 
Can add events: https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/javascript-api */
export default function WidgetScript() {
    return (<Script id="delete_me_onUnload">
                {`
                window.twttr = (function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0], t = window.twttr || {};
                if (d.getElementById(id)) return t;
                js = d.createElement(s);
                js.id = id;
                js.src = "https://platform.twitter.com/widgets.js";
                fjs.parentNode.insertBefore(js, fjs);

                t._e = [];
                t.ready = function(f) {
                    t._e.push(f);
                };

                return t;
                }(document, "script", "twitter-wjs"));`}
            </Script>);
}