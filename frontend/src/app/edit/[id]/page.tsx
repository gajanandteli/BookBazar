"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditBook() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    fetchBook();
  }, []);

  async function fetchBook() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`
      );

      const book = await res.json();

      setTitle(book.title);
      setAuthor(book.author);
      setCategory(book.category);
      setDescription(book.description);
      setPrice(book.price.toString());
      setLocation(book.location);
      setPhone(book.phoneNumber);
    } catch (err) {
      console.error(err);
    }
  }async function handleUpdate() {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            author,
            category,
            description,
            price,
            location,
            phone,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Book updated successfully");
        router.push("/mybooks");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update book");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-6">
          ✏️ Edit Book
        </h1>

        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded mb-4"
          placeholder="Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-3 rounded mb-4"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded mb-6"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="flex gap-4">

          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Save Changes
          </button>

          <button
            onClick={() => router.push("/mybooks")}
            className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700"
          >
            Cancel
          </button>

        </div>

      </div>
    </main>
  );
}