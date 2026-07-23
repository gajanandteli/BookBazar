"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
}

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchProfile(token);
  }, []);

  async function fetchProfile(token: string) {
    try {
      const res = await fetch(
        "${process.env.NEXT_PUBLIC_API_URL}/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl">
        Loading...
      </div>
    );
  }

  return (
  <main className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl">

      <div className="flex flex-col items-center">

        <img
          src={
            user?.avatar
              ? user.avatar
              : "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user?.name || "User")
          }
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-blue-500 mb-4"
        />

        <h1 className="text-3xl font-bold">
          {user?.name}
        </h1>

        <p className="text-gray-500">
          {user?.email}
        </p>

      </div>

      <div className="mt-8 space-y-4">

        <div className="border rounded-lg p-4">
          <p className="text-gray-500 text-sm">Phone</p>
          <p className="font-semibold">
            {user?.phone || "Not Added"}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-gray-500 text-sm">Role</p>
          <p className="font-semibold">
            {(user as any)?.role || "USER"}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-gray-500 text-sm">Member Since</p>
          <p className="font-semibold">
            {(user as any)?.createdAt
              ? new Date((user as any).createdAt).toLocaleDateString()
              : "-"}
          </p>
        </div>

      </div>

      <div className="mt-8 flex gap-4">

        <button
          onClick={() => router.push("/profile/edit")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Edit Profile
        </button>

        <button
          onClick={() => router.push("/")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
        >
          Back Home
        </button>

      </div>

    </div>
  </main>
);
}