"use client";

interface Category {
  _id: string;
  categoryName: string;
}

interface Props {
  categoryName: string; // changed from 'Categoryname: String'
  id:string
  onEdit: (id: string) => void;
  // onDelete?: (id: string) => void;
}

export default function CategoryList({ id,categoryName,onEdit }: Props) {
//   console.log(categoryName);

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white shadow rounded-lg px-4 py-3 flex justify-between items-center">
      <span className="font-medium text-gray-700">{categoryName}</span>

      <div className="flex gap-2">
        <button
          // onClick={() => onEdit?.(cat._id)}
          className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={()=>onEdit(categoryName)}
        >
          Edit
        </button>

        <button className="px-4 py-2 text-sm font-medium text-black hover:text-white rounded-lg shadow hover:bg-red-700 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}
