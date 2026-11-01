export const metadata = { title: 'Article preview', robots: { index: false, follow: false } };

export default function PreviewPage({ searchParams }: { searchParams: { type?: string; slug?: string } }) {
  if (process.env.NEXT_OUTPUT_EXPORT === 'true') return <p>Draft previews are available on the Vercel website.</p>;
  return <main className="max-w-xl mx-auto py-12 space-y-6">
    <h1 className="text-3xl font-bold">Preview an unpublished article</h1>
    <p>Enter your preview password once per hour. Preview uses the same layout and equation renderer as the public article.</p>
    <form action="/api/preview" method="post" className="space-y-4">
      <label className="block">Collection<select name="type" defaultValue={searchParams.type || 'notes'} className="block border p-2 w-full">
        <option value="notes">Notes</option><option value="opinions">Opinions</option><option value="projects">Projects</option>
      </select></label>
      <label className="block">Article URL slug<input name="slug" required defaultValue={searchParams.slug} className="block border p-2 w-full" /></label>
      <label className="block">Preview password<input name="secret" type="password" autoComplete="current-password" className="block border p-2 w-full" /></label>
      <button className="rounded bg-blue-600 text-white px-4 py-2">Open preview</button>
    </form>
    <form action="/api/preview" method="post"><input type="hidden" name="action" value="exit" /><button className="underline">Exit preview</button></form>
  </main>;
}
