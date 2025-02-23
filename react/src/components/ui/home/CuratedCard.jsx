export default function CuratedCard({ imageSrc, title, author, authorImage }) {
  return (
    <div className="max-w-[340px] w-[400px] rounded overflow-hidden border ">
      <img className="w-full" src={imageSrc} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mr-4"
            src={authorImage}
            alt={author}
          />
          <div className="text-sm">
            <p className="text-gray-900 leading-none">{author}</p>
            <p className="text-yellow-500">
              <i className="fas fa-check-circle"></i>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
