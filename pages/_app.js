import '../styles/globals.css'
import '../styles/tweetDisplay.css'
import {useEffect, useState} from "react"
import TweetContext from "../components/shared/tweetContext"

//Apparently, global states should be kept here and transmitted using a React context
function MyApp({ Component, pageProps }) {
  //Globals be here
  const [tweetResults, setTweetResults] = useState({});
  const [searchForTweetInitial, setSearchForTweetInitial] = useState("");

  return <TweetContext.Provider value={
            {
              tweetResults, setTweetResults,
              searchForTweetInitial, setSearchForTweetInitial
              }}>
            <Component {...pageProps} />
          </TweetContext.Provider>
}

export default MyApp
