/*Creates a context for sharing retrieved tweet data between pages
when navigating through the app. The Provider is _app.js, which loads
the corresponding page the user is at every time.
Chose this instead of using localStorage. 
Probably need to add UserContext for logging in and stuff but that will need localStorage 
unless I hate users.*/
import { createContext } from 'react';

const TweetContext = createContext();

export default TweetContext;
