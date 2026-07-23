"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface WishlistItem {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    category: string;
    price: number;
    location: string;
    images: string;
  };
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setWishlist(data);
    } catch (error) {
      console.error(error);
    }
  }
  async function removeWishlist(bookId: string) {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${bookId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setWishlist((prev) =>
        prev.filter((item) => item.book.id !== bookId)
      );
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
}return (
    <main className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">
          ❤️ My Wishlist
        </h1>

        {wishlist.length === 0 ? (

          <div className="text-center text-gray-500 text-xl mt-20">
            Your Wishlist is Empty
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {wishlist.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >

                {item.book.images ? (

                  <img
                    src={item.book.images}
                    alt={item.book.title}
                    className="w-full h-64 object-cover"
                  />

                ) : (

                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>

                )}

                <div className="p-4">

                  <h2 className="text-xl font-bold">
                    {item.book.title}
                  </h2>

                  <p className="text-gray-600">
                    {item.book.author}
                  </p>

                  <p className="text-sm text-gray-500">
                    {item.book.category}
                  </p>

                  <p className="text-green-600 font-bold mt-2">
                    ₹{item.book.price}
                  </p>

                  <p className="text-gray-500 text-sm">
                    📍 {item.book.location}
                  </p>

                  <div className="flex gap-3 mt-4">

                    <Link href={`/books/${item.book.id}`}>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        View
                      </button>
                    </Link>

                    <button
                      onClick={() => removeWishlist(item.book.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Remove
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