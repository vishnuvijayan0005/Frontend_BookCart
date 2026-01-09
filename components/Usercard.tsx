"use client";


export interface UserCardProps {
  name: string;
  email: string;
  id:string
  handleuserdelete: (id: string) => void;
}

export default function UserCard({id, name, email,handleuserdelete }: UserCardProps) {
    const initials = name.slice(0, 2).toUpperCase();
  
    
  return (
    <div className="bg-white shadow-md hover:shadow-lg rounded-xl p-6 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto transition">
      {/* Avatar */}
      <div className="flex items-center gap-6 mb-4">
        <div className="w-16 h-16 rounded-full bg-sky-500 flex items-center justify-center text-white text-2xl font-bold">
          {initials}
        </div>
        <div>
          <h3 className="text-gray-800 font-semibold text-lg sm:text-xl">{name}</h3>
          <p className="text-gray-500 text-sm sm:text-base">{email}</p>
        </div>
      </div>

      {/* Optional actions */}
      <div className="mt-3 flex gap-3">
        {/* <button className="px-4 py-2 text-sm sm:text-base bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition">
          View Profile
        </button> */}
        <button className="px-4 py-2 text-sm sm:text-base bg-red-100 text-red-700 rounded hover:bg-red-200 transition" onClick={()=>handleuserdelete(id)}>
          Remove
        </button>
      </div>
    </div>
  );
}
