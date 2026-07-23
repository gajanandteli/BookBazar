"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react"

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  location: string;
  images: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    fetchBooks();

    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      fetchWishlist();
    }
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

    setWishlist(data.map((item: any) => item.book.id));
  } catch (error) {
    console.error(error);
  }
}

  async function fetchBooks() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books`);

      if (!res.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    alert("Logout Successful");
    window.location.reload();
  }
async function toggleWishlist(bookId: string) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  try {
    if (wishlist.includes(bookId)) {
      // Remove from wishlist
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
        setWishlist((prev) => prev.filter((id) => id !== bookId));
      } else {
        alert(data.message);
      }
    } else {
      // Add to wishlist
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookId }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setWishlist((prev) => [...prev, bookId]);
      } else {
        alert(data.message);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

  const filteredBooks = books
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || book.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  return (<main className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4 p-5">

          <Link href="/">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold cursor-pointer text-center">
              📚 BookBazaar
            </h1>
          </Link>

          <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto">

            <Link href="/">
              <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
                Home
              </button>
            </Link>

            {loggedIn && (
              <Link href="/sell">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Sell Book
                </button>
              </Link>
            )}
            <Link href="/mybooks">
  <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
    My Books
  </button>
</Link>

<Link href="/profile">
  <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
    Profile
  </button>
</Link>
<Link href="/wishlist">
  <button className="w-full sm:w-auto bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
    ❤️ Wishlist
  </button>
</Link>
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login">
                  <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Login
                  </button>
                </Link>

                <Link href="/signup">
                  <button className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Signup
                  </button>
                </Link>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="text-center py-10">
        <h2 className="text-5xl font-bold">
          Buy & Sell Used Books
        </h2>

        <p className="text-gray-600 mt-3 text-lg">
          Find affordable books or sell your old books.
        </p>
      </div>

      {/* Search + Filter + Sort */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="🔍 Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg p-3 flex-1"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg p-3"
          >
            <option value="All">All Categories</option>
            <option value="School">School</option>
            <option value="College">College</option>
            <option value="Novel">Novel</option>
            <option value="Programming">Programming</option>
            <option value="Competitive">Competitive</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg p-3"
          >
            <option value="default">Sort By</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>

        </div>
      </div>

      {/* Books */}
      <div className="max-w-7xl mx-auto px-6 pb-10">

        {filteredBooks.length === 0 ? (

          <div className="text-center text-xl text-gray-500 mt-20">
            No Books Found
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {filteredBooks.map((book) => (

              <Link key={book.id} href={`/books/${book.id}`}>

                <div className="relative flex flex-col h-full bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer">
<button
  onClick={(e) => {
    e.preventDefault();
    toggleWishlist(book.id);
  }}
  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-100 z-10"
>
  <Heart
  fill={wishlist.includes(book.id) ? "currentColor" : "none"}
  className={`w-5 h-5 ${
    wishlist.includes(book.id)
      ? "text-red-500"
      : "text-gray-400"
  }`}
/>
</button>
{book.images ? (
  <img
    src={
      book.images.startsWith("http")
        ? book.images
        : `${process.env.NEXT_PUBLIC_API_URL}${book.images}`
    }
    alt={book.title}
    className="w-full aspect-[3/4] object-cover"
  />
) : (
  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
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
                      {book.category}
                    </p>

                    <p className="text-green-600 font-bold mt-2">
                      ₹{book.price}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      📍 {book.location}
                    </p>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}