// src/components/ErrorPage.jsx
export default function ErrorPage({ error }) {
  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold text-red-500">Error</h2>
      <p>{error.status === 302 ? "Redirecting..." : error.statusText}</p>
    </div>
  );
}
