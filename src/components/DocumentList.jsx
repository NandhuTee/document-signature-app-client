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
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Uploaded Documents</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <ul className="space-y-2">
        {docs.map((doc) => (
          <li key={doc._id} className="bg-white p-2 shadow">
            <a
              href={`https://document-signature-app-server-zp95.onrender.com/${doc.path}`}
              target="_blank"
              rel="noreferrer"
            >
              {doc.filename}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DocumentList;
