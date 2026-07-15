const books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', category: 'Novel', price: '₹320', condition: 'Good' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', price: '₹600', condition: 'Like New' },
  { id: 3, title: 'Operating System Concepts', author: 'Silberschatz', category: 'Engineering', price: '₹450', condition: 'Fair' },
];

export default function BooksPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Browse books</p>
          <h1 className="text-3xl font-semibold text-slate-900">Search, filter, and find your next read</h1>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">Nearby books • Wishlist • Reviews</div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {books.map((book) => (
          <div key={book.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 h-32 rounded-2xl bg-slate-100" />
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{book.category}</span>
              <span>{book.condition}</span>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">{book.title}</h2>
            <p className="text-sm text-slate-600">{book.author}</p>
            <div className="mt-5 flex items-center justify-between">
              <span className="font-semibold text-slate-900">{book.price}</span>
              <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">View details</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
