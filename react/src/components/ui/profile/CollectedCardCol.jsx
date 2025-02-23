export default function CollectedCardCol({ imageSrc, title, name, price }) {
  return (
    <div className="flex items-center space-x-4">
      <img
        src={imageSrc ? imageSrc : "https://placehold.co/300x300"}
        alt="Uniswap V3 Positions NFT"
        className="w-24 h-20 object-cover"
      />
      <div className="text-start">
        <div className="text-black font-semibold">{title}</div>
        <div className="text-gray-500 text-sm line-clamp-1">{name}</div>
        <div className="text-black font-medium text-lg font-mono">
          {price}
          <span className="ml-1 text-sm  text-gray-500">ETH</span>
        </div>
      </div>
    </div>
  );
}
