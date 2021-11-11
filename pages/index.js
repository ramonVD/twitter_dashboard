import Head from 'next/head'
import redirectDiv from "../components/startingPage/redirectDiv"
import loginBar from "../components/shared/loginBar"
import footer from "../components/shared/footer"

export default function Home() {
  return (
    <div className="flex h-screen flex-col w-screen">
      <Head>
        <title>Twitter dashboard</title>
        <meta name="description" content="Twitter dashboard thingy thing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        {loginBar()}

      <main className="flex w-full h-full items-center justify-center">
        <div className="grid grid-cols-2 sm:gap-5 gap-2">
          {redirectDiv("Search query", "/query")}
          {redirectDiv("Saved tweets", "/savedTweets")}
        </div>
      </main>

        {footer(true)}
    </div>
  )
}
