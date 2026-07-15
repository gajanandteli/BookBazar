import Link from 'next/link';
import { ArrowRight, BookOpen, MapPin, Search, Sparkles, Star } from 'lucide-react';

const featuredBooks = [
  { title: 'The Alchemist', author: 'Paulo Coelho', price: '₹320', location: 'Delhi' },
  { title: 'Atomic Habits', author: 'James Clear', price: '₹450', location: 'Mumbai' },
  { title: 'Clean Code', author: 'Robert C. Martin', price: '₹600', location: 'Bengaluru' },
];

const categories = ['Engineering', 'Medical', 'School', 'College', 'Programming', 'Novel'];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-center lg:py-28">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
            <Sparkles size={16} /> Modern marketplace for old books
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Buy, sell, and discover books near you.
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            BookBazaar helps students, readers, and collectors trade quality used books with instant discovery, chat, and secure listings.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/books" className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Explore Books
            </Link>
            <Link href="/sell" className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-primary hover:text-primary">
              Sell a Book
            </Link>
          </div>
        </div>

        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <Search className="text-primary" />
            <input className="w-full bg-transparent outline-none" placeholder="Search by book name, author, category..." />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <div key={category} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                {category}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Featured books</h2>
          <Link href="/books" className="text-sm font-semibold text-primary">View all</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredBooks.map((book) => (
            <div key={book.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-green-100">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={14} fill="currentColor" />
                ))}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{book.title}</h3>
              <p className="text-sm text-slate-600">{book.author}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{book.price}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {book.location}</span>
              </div>
              <Link href="/books" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                View details <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
