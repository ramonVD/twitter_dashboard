import Link from "next/link"

//Massa fixat, cal canviar-lo a que sigui design agnostic k no ocupi tota la pantalla etc...
export default function redirectDiv(text="", link="/") {
	return (
        <Link href={link}>
        <div className="sm:p-9 p-4 border border-2 rounded-sm border-indigo-600 hover:bg-gray-200 cursor-pointer text-center">
          <a className="sm:text-2xl text-xl font-bold text-blue-800">{text}</a>
        </div>
        </Link>
	)
}