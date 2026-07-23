"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SellPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("author", author);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("location", location);
      formData.append("phone", phone);
      formData.append("image", image);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/books`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Book uploaded successfully");

        setTitle("");
        setAuthor("");
        setCategory("");
        setDescription("");
        setPrice("");
        setLocation("");
        setPhone("");
        setImage(null);
        setPreview("");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        router.push("/");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Sell a Book
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-lg rounded-xl p-5 sm:p-8"
      >
        <input
          type="text"
          placeholder="Book Title"
          className="w-full border rounded-lg p-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Author Name"
          className="w-full border rounded-lg p-3"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <select
          className="w-full border rounded-lg p-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="School">School</option>
          <option value="College">College</option>
          <option value="Novel">Novel</option>
          <option value="Programming">Programming</option>
          <option value="Competitive">Competitive</option>
        </select>

        <textarea
          placeholder="Description"
          className="w-full border rounded-lg p-3 min-h-32 resize-y"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border rounded-lg p-3"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full border rounded-lg p-3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border rounded-lg p-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="w-full border rounded-lg p-3"
          onChange={(e) => {
            if (e.target.files?.length) {
              const file = e.target.files[0];
              setImage(file);
              setPreview(URL.createObjectURL(file));
            }
          }}
          required
        />

        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-80 object-cover rounded-lg border shadow"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Sell Book"}
        </button>
      </form>
    </main>
  );
}