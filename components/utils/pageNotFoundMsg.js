import Link from "next/link"

//Massa fixat, cal canviar-lo a que sigui design agnostic k no ocupi tota la pantalla etc...
export default function PageNotFoundMsg(msg="Page not found", gobackName="↲ Go back", gobackLink="/") {
	return (
		<div className="w-screen h-screen">
		<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/4 text-center">
			<h1 className="mt-0 font-bold text-xl my-3">{msg}</h1>
				<Link href={gobackLink}>
					<a className="standardLink text-lg">{gobackName}</a>
				</Link>
			</div>
		</div>
	)
}