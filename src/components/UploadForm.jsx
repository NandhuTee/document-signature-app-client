// UploadForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadForm() {
  const navigate = useNavigate(); 
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return setMessage("Please choose a file first.");

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

      const handleUpload = async () => {
    // ... your upload logic
    if (res.ok) {
      setMessage('✅ Upload successful!');
      setTimeout(() => {
        navigate('/documents');  // redirects to dashboard
      }, 1000);
    }
  };

    try {
      const res = await fetch('https://document-signature-app-server-zp95.onrender.com/api/docs/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Upload successful!');
        console.log(data);
      } else {
        setMessage('❌ Upload failed.');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Server error');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload a Document</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">Upload</button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}

export default UploadForm;
