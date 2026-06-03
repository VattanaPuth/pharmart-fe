import CategoryItem from "./CategoryItem";

export default function CategoryList({ categories, onAddSub, onUpdate }) {
  return (
    <div className="space-y-4 text-gray-700">
      {categories.map((cat) => (
        <CategoryItem
          key={cat.id}
          category={cat}
          onUpdate={onUpdate}
          onAddSub={onAddSub}
        />
      ))}
    </div>
  );
}
