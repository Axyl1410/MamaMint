import ExploreFillters from "../components/ui/explore/ExploreFillters";
import ExploreCard from "../components/ui/explore/ExploreCard";
export default function Explore() {
  return (
    <div className="p-6">
      <ExploreFillters />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <ExploreCard />
        <ExploreCard />
        <ExploreCard />
        <ExploreCard />
        <ExploreCard />
        <ExploreCard />
        <ExploreCard />
        <ExploreCard />
        <ExploreCard />
      </div>
    </div>
  );
}
