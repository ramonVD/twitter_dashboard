import Head from 'next/head'
import RedirectDiv from "../components/startingPage/redirectDiv"
import Navbar from "../components/shared/navbar"
import Footer from "../components/shared/footer"

export default function Home() {
  return (
    <div className="flex h-screen flex-col w-screen">
      <Head>
        <title>Twitter dashboard</title>
        <meta name="description" content="Twitter dashboard thingy thing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        {Navbar()}

      <main className="flex w-full h-full items-center justify-center">
        <div className="grid grid-cols-2 sm:gap-5 gap-2">
          {RedirectDiv("Search query", "/searchTweets")}
          {RedirectDiv("Saved tweets", "/savedTweets")}
        </div>
      </main>

        {Footer(true)}
    </div>
  )
}
