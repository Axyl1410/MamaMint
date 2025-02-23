export default function CollectedCardRow({ imageSrc, title, name, price }) {
  return (
    <div className="flex flex-col items-center max-w-56 ">
      <div className="border border-gray-300 ">
        <img
          src={imageSrc ? imageSrc : "https://placehold.co/300x300"}
          alt="A large group of people forming the letters 'I', 'L', and 'A' with red heart shapes"
          className="w-32 h-auto"
        />
      </div>
      <div className="mt-4 text-center flex space-x-4 text-sm justify-between items-center ">
        <p className=" font-medium line-clamp-2 max-w-20 ">
          {name ? name : "Uniswap V3 Positions NFT"}
        </p>
        <p className="font-medium border border-gray-300 rounded-md px-2 py-1 min-w-max font-mono">
          {price ? price : "0.008 ETH"}
          <span className="ml-1 text-sm">ETH</span>
        </p>
      </div>
    </div>
  );
}
