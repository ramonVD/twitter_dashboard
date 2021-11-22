import '../styles/globals.css'
import '../styles/tweetDisplay.css'
import {useState} from "react"
import TweetContext from "../components/global/tweetContext"
import { SessionProvider } from "next-auth/react"

//Apparently, global states should be kept here and transmitted using a React context
function MyApp({ Component, pageProps: { session, ...pageProps }, }) {
  //Globals be here
  const [tweetResults, setTweetResults] = useState({});
  const [searchForTweetInitial, setSearchForTweetInitial] = useState("");

  return (
        
    <SessionProvider session={session}>
        <TweetContext.Provider value={{
              tweetResults, setTweetResults,
              searchForTweetInitial, setSearchForTweetInitial
              }}>
            <Component {...pageProps} />
        </TweetContext.Provider>
      </SessionProvider>
  );
}

export default MyApp
