import CollectionList from "../components/ui/home/CollectionList";
import DiscordBanner from "../components/ui/home/DiscordBanner";
import ListingNFT from "../components/ui/home/ListingNFT";

export default function Home() {

    return (
        <div className="w-full">
            <div className="relative">
                <div className="px-4 sm:px-10 text-white min-h-[400px]">
                    <div className="mt-16 max-w-4xl mx-auto text-center relative z-10">
                        <h1 className="md:text-6xl text-4xl font-extrabold mb-6 md:!leading-[75px] bg-gradient-to-r from-purple-400 to-cyan-500 text-transparent bg-clip-text">
                            Create Unique NFT Collections
                            with Generative Art Power
                        </h1>
                        <p className="text-base text-gray-300">
                            Dive into a world where creativity meets code. Craft mesmerizing generative art NFT
                            collections,
                            where each piece is unique, rare, and truly yours. Let your imagination run free in the
                            digital realm.
                        </p>
                        <div className="mt-10">
                            <button
                                className="px-6 py-3 rounded-xl text-white bg-gradient-to-r from-purple-600 to-cyan-600 transition-all hover:opacity-80 shadow-lg shadow-cyan-500/50">
                                Start Creating Now
                            </button>
                        </div>
                    </div>
                    {/*<hr className="my-12 border-gray-700"/>*/}
                    {/*<div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">*/}
                    {/*    <img src="https://readymadeui.com/opensea-logo.svg" className="w-28 mx-auto" alt="opensea-logo"/>*/}
                    {/*    <img src="https://readymadeui.com/ethereum-logo.svg" className="w-28 mx-auto" alt="ethereum-logo"/>*/}
                    {/*    <img src="https://readymadeui.com/solana-logo.svg" className="w-28 mx-auto" alt="solana-logo"/>*/}
                    {/*    <img src="https://readymadeui.com/polygon-logo.svg" className="w-28 mx-auto" alt="polygon-logo"/>*/}
                    {/*</div>*/}
                </div>
                <CollectionList/>
                <ListingNFT />
                <DiscordBanner/>
            </div>
        </div>
    );
}