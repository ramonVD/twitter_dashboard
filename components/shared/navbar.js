import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react"
import Spinner from "./spinner";

//Need to add props when implementing login, the way its setup now doesnt make sense in next
export default function Navbar(options={}) {
    const { data: session, status } = useSession();
    const loading = status === "loading";

    return (
        <header className="flex justify-between w-full items-center bg-gray-100 border-b border-gray-200">
            <div className="flex justify-start items-center m-2 px-4">
                    <Image className="p-3" src="/icons/header_icon.png" width={46} height={46} alt="App logo"/>
                    <p className="pl-2 md:text-lg sm:text-base text-sm font-bold text-gray-700">Twitter thingyneitor</p>
                </div>
            <div className="flex m-2 px-4 ">
                {loading && Spinner("","animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-2 ml-4",
                            "mb-1 mt-1 text-lg text-blue-600", "Loading...")}
                {!loading && !session && 
                    <div className="order-last text-center bg-blue-500 hover:bg-blue-700 text-white md:text-xl text-base font-bold md:py-2 md:px-4 py-1 px-3 border border-blue-700 rounded">
                        <Link href="/api/auth/signin">
                            <a onClick={(e) => {e.preventDefault(); signIn();}}>
                                {"Login here"}
                            </a>
                        </Link>
                    </div>}
                {!loading && session && 
                    <div>Hello, <span className="font-bold">{session.user.email || session.user.name}</span>
                    <div className="order-last text-center bg-gray-600 hover:bg-gray-800 text-white md:text-xl text-base font-bold md:py-2 md:px-4 py-1 px-3 border border-gray-900 rounded">
                        <Link href="/api/auth/signout">
                            <a onClick={(e) => {e.preventDefault(); signOut();}}>
                                {"Log out"}
                            </a>
                        </Link>
                    </div>
                </div>}
            </div>
        </header>
    );
}