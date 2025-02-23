export default function ExploreCard({ imageSrc, title, author, authorImage }) {
  return (
    <div className="bg-white rounded-lg border">
      <img
        src="https://placehold.co/400x400"
        alt="Pixel art of a chicken wearing a hat on a blue background"
        className="w-full rounded-t-lg"
      />
      <div className="py-4 px-6 flex justify-between  text-gray-600">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium line-clamp-1 max-w-56 text-black ">
            "Pixelated image of a person"
          </h2>
          <div className="flex gap-2 items-center">
            <img
              src="https://placehold.co/400x400"
              alt="Pixelated image of a person"
              className="rounded-full w-8 h-8 object-cover"
            />
            <p className="flex items-center gap-2">
              <span className="text-sm ">MDDD</span>
            </p>
          </div>
        </div>
        <p className="text-gray-900 font-mono">0.002 ETH</p>
      </div>
    </div>
  );
}
