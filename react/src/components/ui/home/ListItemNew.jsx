import NewreleasesCard from "./NewreleasesCard";

export default function ListItemNew() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-bold mb-8">New releases</h1>
      <div className="space-y-8">
        <NewreleasesCard />
        <NewreleasesCard />
        <NewreleasesCard />

        <div className="flex justify-between items-center gap-10">
          <div className="w-full h-[1px] bg-slate-200"></div>
          <span className="hover:cursor-pointer uppercase text-xs w-40 font-medium text-gray-500">
            See more
          </span>
          <div className="w-full h-[1px] bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
}
