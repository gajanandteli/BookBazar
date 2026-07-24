"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = await res.json();

      setName(user.name || "");
      setPhone(user.phone || "");
    } catch (error) {
      console.error(error);
    }
  }async function handleSave() {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            phone,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Profile updated successfully");
        router.push("/profile");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">

        <h1 className="text-3xl font-bold mb-6">
          Edit Profile
        </h1>

        <label className="block mb-2 font-medium">
          Name
        </label>

        <input
          type="text"
          className="w-full border rounded-lg p-3 mb-5"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block mb-2 font-medium">
          Phone
        </label>

        <input
          type="text"
          className="w-full border rounded-lg p-3 mb-6"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="flex gap-4">

          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Save Changes
          </button>

          <button
            onClick={() => router.push("/profile")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
          >
            Cancel
          </button>

        </div>

      </div>
    </main>
  );
}