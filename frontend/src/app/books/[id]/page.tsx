"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  condition: string;
  price: number;
  location: string;
  phoneNumber: string;
  images: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
}

export default function BookDetails() {
  const params = useParams();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`
        );

        const data = await res.json();

        setBook(data);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    if (id) fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Loading...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-2xl">
        Book Not Found
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-6 sm:px6 lg:px-8">

    <div className="flex flex-col sm:flex-row gap-3 mb-8">
  <Link href="/">
    <button className="w-full sm:w-auto bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800">
      ← Back to Home
    </button>
  </Link>

  <Link href={`/chat/${book.seller.id}`}>
    <button className="w-full sm:w-auto bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
      💬 Chat with Seller
    </button>
  </Link>
</div>  

      <div className="grid md:grid-cols-2 gap-10">

        <img
          src={book.images}
          alt={book.title}
          className="w-full aspect-[3/4] rounded-xl shadow-lg object-cover"
        />

        <div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            {book.title}
          </h1>

          <p className="mt-4 text-xl">
            ✍ Author:
            <span className="font-semibold">
              {" "}
              {book.author}
            </span>
          </p>

          <p className="mt-3 text-lg">
            📚 Category:
            <span className="font-semibold">
              {" "}
              {book.category}
            </span>
          </p>

          <p className="mt-3 text-lg">
            ⭐ Condition:
            <span className="font-semibold">
              {" "}
              {book.condition}
            </span>
          </p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-green-600 font-bold mt-6">
            ₹ {book.price}
          </h2>

          <div className="mt-8">
            <h3 className="text-2xl font-bold">
              Description
            </h3>

            <p className="mt-2 text-gray-700 leading-8">
              {book.description}
            </p>
          </div>

          <div className="mt-8 space-y-3">

            <p>
              📍 <strong>Location:</strong>{" "}
              {book.location}
            </p>

            <p>
              👤 <strong>Seller:</strong>{" "}
              {book.seller?.name}
            </p>

            <p>
              📞 <strong>Phone:</strong>{" "}
              {book.phoneNumber}
            </p>

          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">

            <a
              href={`https://wa.me/${book.phoneNumber}`}
              target="_blank"
             className="w-full sm:w-auto text-center bg-green-600 text-white px-6 py-3 rounded-lg">
              💬 WhatsApp
            </a>

            <a
              href={`tel:${book.phoneNumber}`}
              className="w-full sm:w-auto text-center bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              📞 Call Seller
            </a>

          </div>

        </div>

      </div>

    </main>
  );
}