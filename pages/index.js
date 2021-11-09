import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex h-screen flex-col w-screen">
      <Head>
        <title>Twitter dashboard</title>
        <meta name="description" content="Twitter dashboard thingy thing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex justify-end w-full h-10 items-center">
        <div className="order-last px-3">
        <p>Login here</p>
        </div>
      </header>

      <main className="flex w-full h-full items-center">
        <div className="grid grid-cols-2 gap-9 mx-auto">
          <Link href="/query">
            <div className="p-9 border border-2 rounded-sm border-indigo-600 hover:bg-gray-200 cursor-pointer">
              <a className="text-2xl font-bold text-blue-800">Search query</a>
            </div>
          </Link>
          <Link href="/savedTweets">
            <div className="p-9 border border-2 rounded-sm border-indigo-600 hover:bg-gray-200 cursor-pointer">
              <a className="text-2xl font-bold text-blue-800">Saved tweets</a>
            </div>
          </Link>
        </div>
      </main>

      <footer className="flex flex-row w-full h-10 items-center">
        <div className="flex-none mx-auto">
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className="">
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </div>
      </footer>
    </div>
  )
}
