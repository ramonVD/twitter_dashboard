import {useState} from "react"


/*Adapted from the default login page from tailwindscss*/
export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [pwd, setPwd] = useState("");

    //Not implemented
    const handleSubmitLogin = async e => {
        e.preventDefault();
        const token = await loginFunction({us});
    }

    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <form onSubmit={handleSubmitLogin}>
            <div className="mb-4">
                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="username">
                    Username
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                    onChange={(e) => {setUsername(e.target.value)}} id="username" type="text" placeholder="Username" />
                </div>
                <div className="mb-6">
                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
                    onChange={(e) => {setPwd(e.target.value)}} id="password" type="password" placeholder="******************" />
                <p className="text-red text-xs italic">Please choose a password.</p>
                </div>
                <div className="flex items-center justify-between">
                <button className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded" type="button">
                    Sign In
                </button>
                <a className="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker" href="#">
                    Forgot Password?
                </a>
            </div>
        </form>
    </div>
    </div>
        );
    }
