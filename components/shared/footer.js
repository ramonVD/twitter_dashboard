import Link from "next/link"
import Image from 'next/image'

/*Footer for the webpages. So far two types, footer on the homepage
with a fake logo (so far), and a "go back" footer for the rest
of the pages that sends you to the homepage on clickin*/ 
export default function footer(home=true, gobackName="↲ Go back", goBackLink="/") {
    if (home) { 
        return (
            <footer className="flex flex-row w-full h-16 items-center">
                <div className="mx-auto">
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
        )
    } else {
        return (
            <footer className="flex flex-row w-full h-full items-end my-3">
                <div className="mx-auto">
                    <Link href={goBackLink}>
                        <a className="text-2xl standardLink">{gobackName}</a>
                    </Link>
                </div>
            </footer>
        )
    }
}
    