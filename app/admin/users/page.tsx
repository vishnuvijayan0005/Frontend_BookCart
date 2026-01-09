"use client";
import AdminSidebar from "@/components/AdminSidebar";
import UserCard from "@/components/Usercard";
import api from "@/utils/baseUrl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
export interface User {
  _id: string;
  username: string;
  usermail: string;
}
function Users() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const checkAndFetch = async () => {
      const stored = localStorage.getItem("user");
      const userRole = stored ? JSON.parse(stored) : null;

      if (!userRole || userRole !== "admin") {
        router.replace("/");
        return;
      }

      try {
        const response = await api.get("/admin/userlist");

        setUsers(response.data.data); 
       
        
      } catch (err) {
        console.error("Error fetching user list:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAndFetch();
  }, [router]);
  if (loading) return <p>Checking access...</p>;
const handleuserdelete=async(id:string)=>{
try {
    await api.delete(`/admin/userdelete/${id}`)
    toast.success("user deleted successfully")
    setUsers((p)=>p.filter((user)=>user._id!==id))
} catch (error) {
    console.log(error);
    toast.error("Failed to delete user")
    
}

}

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 p-6 md:ml-64">
        <h1 className="text-2xl font-semibold mb-6">Users</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user._id} id={user._id} name={user.username} email={user.usermail} handleuserdelete={handleuserdelete}/>
          ))}
        </div>
      </div>
      <Toaster/>
    </div>
  );
}

export default Users;
