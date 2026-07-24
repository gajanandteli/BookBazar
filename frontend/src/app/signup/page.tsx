"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

  setForm((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }
  );
    const data = await res.json();

    if (data.success) {
      alert("Signup Successful");
      localStorage.setItem("token", data.token);
      router.push("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-96 p-6 border rounded-lg"
      >
        <h1 className="text-2xl font-bold">Signup</h1>

        <input
          name="name"
          value={form.name}
          placeholder="Name"
          onChange={handleChange}
          className="border p-2"
        />

        <input
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          className="border p-2"
        />

        <input
          name="phone"
          value={form.phone}
          placeholder="Phone"
          onChange={handleChange}
          className="border p-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Signup
        </button>
      </form>
    </div>
  );
}