export default function SellPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Sell your book</p>
        <h1 className="text-3xl font-semibold text-slate-900">List a book in minutes</h1>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Book name</label>
              <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="e.g. Mathematics for Class 10" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Author</label>
              <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Author name" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
              <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Engineering / Novel / etc" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Price</label>
              <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="₹250" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea className="min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Describe the book condition and details" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
              <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Delhi, India" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone number</label>
              <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="+91 98765 43210" />
            </div>
            <button className="w-full rounded-2xl bg-primary px-4 py-3 font-semibold text-white">Publish listing</button>
          </div>
        </div>
      </div>
    </main>
  );
}
