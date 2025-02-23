import CollectedCardCol from "./CollectedCardCol";

export default function ListCollectedCols({ collections }) {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-8 ">
      {collections.map((item) => (
        <CollectedCardCol
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
