import Head from 'next/head'
import RedirectDiv from "../components/startingPage/redirectDiv"
import Navbar from "../components/shared/navbar"
import Footer from "../components/shared/footer"
import {useState} from "react"

export default function Home() {
  //placeholder, this will be moved to another place
  const [msg, setMsg] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  return (
    <div className="flex h-screen flex-col w-screen">
      <Head>
        <title>Twitter dashboard</title>
        <meta name="description" content="Twitter dashboard thingy thing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        {Navbar()}

      <main className="flex w-full h-full items-center justify-center">
        <div className="grid grid-rows-2 gap-1">
          <div className="grid grid-cols-2 sm:gap-5 gap-2">
            {RedirectDiv("Search query", "/searchTweets")}
            {RedirectDiv("Saved tweets", "/savedTweets")}
          </div>
          <div className="grid grid-rows-2 gap-1">
          <button onClick={() => {if (msg !== "") { sendTelegramMsg(msg, setMsg, setPlaceholder);} else { setPlaceholder("Not an empty msg!")}}}
          className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">
            Send a msg to telegram
          </button>
            <div className="">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="msg">
                Message
              </label>
              <input value={msg} onChange={e => setMsg(e.target.value)} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="msg" type="text" placeholder={placeholder}/>
            </div>
            
          </div>
          </div>
      </main>

        {Footer(true)}
    </div>
  )
}


async function sendTelegramMsg(msg, setMsg, setPlaceholder) {
  const url = `/api/telegram/sendMessageToChat?msg=${msg}`;

		const result = await fetch(url)
			.then(res => res.json())
			.then(data => {
        if (data.hasOwnProperty("success") && data.success){
          setMsg("");
          setPlaceholder("message sent successfully!");
        }
      });
}