import { useEffect, useState } from 'react';

function DocumentList() {
  const [docs, setDocs] = useState([]);

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

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">Uploaded Documents</h2>
      <ul className="space-y-2">
        {docs.map((doc) => (
          <li key={doc._id} className="bg-white p-2 shadow">
            <a href={`https://document-signature-app-server-zp95.onrender.com/${doc.path}`} target="_blank" rel="noreferrer">
              {doc.filename}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DocumentList;
