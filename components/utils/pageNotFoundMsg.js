import Link from "next/link"

//Massa fixat, cal canviar-lo a que sigui design agnostic k no ocupi tota la pantalla etc...
export default function pageNotFoundMsg(customMsg="Page not found", customGoBack="↲ Go back") {
	return (
		<div className="w-screen h-screen">
		<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/4 text-center">
			<h1 className="mt-0 font-bold text-xl my-3">{customMsg}</h1>
				<Link href="/">
					<a className="standardLink text-lg">{customGoBack}</a>
				</Link>
			</div>
		</div>
	)
}