import Image from "next/image"

/*Card with extra info about a tweet. This uses a parody image, not implemented really yet.
Need to improve the css*/
export default function tweetInfoCard(params) {
    return (
        <div className="rounded overflow-hidden shadow-lg">
        <Image className="" src="/img/Tweet.png" alt="Ayup" width={320} height={235} />
        <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Twitter info binch</div>
            <p className="text-gray-700 text-base">
            A bloo bloo
            </p>        
            <p className="text-xl">Tags (give a bg to this)</p>
        </div>
        <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#Tags1</span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#Tags2</span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#Tags3</span>
        </div>
    </div>
    )
}