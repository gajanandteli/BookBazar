"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  location: string;
  images: string;
  isSold: boolean;
}

export default function MyBooks() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchMyBooks(token);
  }, []);

  async function markAsSold(id: string) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}/sold`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed");
    }

    alert("Book marked as Sold");

    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Failed to mark as sold");
  }
}
async function handleDelete(id: string) {
  const ok = confirm("Are you sure you want to delete this book?");

  if (!ok) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Book deleted successfully");

      setBooks((prev) =>
        prev.filter((book) => book.id !== id)
      );
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Failed to delete book");
  }
}

  async function fetchMyBooks(token: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/books/my-books`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await res.json();
      setBooks(data);
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

  return (<main className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto p-6">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            📚 My Books
          </h1>

          <Link href="/">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
              ← Home
            </button>
          </Link>

        </div>

        {books.length === 0 ? (

          <div className="bg-white rounded-xl shadow-md p-10 text-center">

            <h2 className="text-3xl font-bold">
              No Books Found
            </h2>

            <p className="text-gray-500 mt-3">
              You haven't uploaded any books yet.
            </p>

            <Link href="/sell">
              <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                Sell Your First Book
              </button>
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {books.map((book) => (

              <div
                key={book.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >

                {book.images ? (

                  <img
                    src={book.images}
                    alt={book.title}
                    className="w-full h-60 object-cover"
                  />

                ) : (

                  <div className="w-full h-60 bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>

                )}

                <div className="p-4">

                  <h2 className="text-xl font-bold">
                    {book.title}
                  </h2>

                  <p className="text-gray-600">
                    {book.author}
                  </p>

                  <p className="text-gray-500 text-sm">
                    📚 {book.category}
                  </p>

                  <p className="text-green-600 font-bold mt-2">
                    ₹{book.price}
                  </p>

                  <p className="text-gray-500 text-sm">
                    📍 {book.location}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link href={`/books/${book.id}`}>
                      <button className="flex-1 min-w-[100px] bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
                        View
                      </button>
                    </Link>
                  
                    <Link href={`/edit/${book.id}`}>
                      <button
                        className="flex-1 min-w-[100px] bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600" >
                        Edit
                      </button>
                    </Link>
{book.isSold ? (
  <button
    disabled
    className="bg-gray-500 text-white px-4 py-2 rounded-lg cursor-not-allowed"
  >
    ✅ Sold
  </button>
) : (
  <button
    onClick={() => markAsSold(book.id)}
   className="flex-1 min-w-[100px] bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700"
  >
    Mark as Sold
  </button>
)}
                    <button
                    onClick={() => handleDelete(book.id)}
                     className="flex-1 min-w-[100px] bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}