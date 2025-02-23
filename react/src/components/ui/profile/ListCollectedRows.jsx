import CollectedCardRow from "./CollectedCardRow";

export default function ListCollectedRows({ collections }) {
  console.log(collections);

  return (
    <div className="grid grid-cols-6 gap-x-4 gap-y-8">
      {collections.map((item) => (
        <CollectedCardRow
          key={item.id}
          imageSrc={item.imageSrc}
          title={item.title}
          name={item.name}
          price={item.price}
        />
      ))}
    </div>
  );
}
