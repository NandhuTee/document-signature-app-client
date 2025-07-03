// src/components/ErrorPage.jsx
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold text-red-500">❌ Error</h2>
      <p className="text-gray-600">
        {error.status === 302 ? "Redirecting..." : error.statusText || "Page Not Found"}
      </p>
    </div>
  );
}
