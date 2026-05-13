import Card from "./CardSection";

const CardGrid = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* First Row */}
        <Card />
        <Card />
        <Card />

        {/* Second Row */}
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default CardGrid;