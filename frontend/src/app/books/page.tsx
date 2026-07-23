import Link from "next/link";

const books = [
  {
    id: 1,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Novel",
    price: "₹320",
    condition: "Good",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    price: "₹600",
    condition: "Like New",
  },
  {
    id: 3,
    title: "Operating System Concepts",
    author: "Silberschatz",
    category: "Engineering",
    price: "₹450",
    condition: "Fair",
  },
];

export default function BooksPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Available Books</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="border rounded-xl p-5 shadow bg-white"
          >
            <h2 className="text-xl font-semibold">{book.title}</h2>

            <p>Author: {book.author}</p>
            <p>Category: {book.category}</p>
            <p>Condition: {book.condition}</p>

            <p className="font-bold text-lg mt-3">{book.price}</p>

            <Link
              href={`/books/${book.id}`}
              className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}