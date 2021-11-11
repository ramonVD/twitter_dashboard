import Link from "next/link"
import Image from 'next/image'

//Probably add a couple of types of header
export default function footer(home=true) {
    if (home) { 
        return (
            <footer className="flex flex-row w-full h-10 items-center">
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
            <footer className="flex flex-row w-full h-10 items-center">
                <div className="mx-auto">
                    <Link href="/">
                        <a className="text-xl standardLink">↲ Go back</a>
                    </Link>
                </div>
            </footer>
        )
    }
}
    