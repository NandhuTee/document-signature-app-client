// src/components/DocumentList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DocumentList() {
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('https://document-signature-app-server-zp95.onrender.com/api/docs', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setDocs(data);
    };

    fetchDocs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login
  };

  const handleSign = (docId) => {
    navigate(`/sign/${docId}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">📁 Uploaded Documents</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {docs.length === 0 ? (
        <p className="text-gray-500">No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {docs.map((doc) => (
            <li key={doc._id} className="bg-white shadow-md rounded p-4 flex justify-between items-center">
              <a
                href={`https://document-signature-app-server-zp95.onrender.com/${doc.path}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {doc.filename}
              </a>
              <button
                onClick={() => handleSign(doc._id)}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                ✍️ Sign
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DocumentList;
