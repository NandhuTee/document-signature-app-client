import { useState } from 'react';

function UploadForm() {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('https://document-signature-app-server-zp95.onrender.com/api/docs/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      alert('Upload success!');
    } else {
      alert(data.error || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleUpload} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-semibold text-center">Upload Document</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full" required />
      <button className="w-full p-2 bg-purple-600 text-white">Upload</button>
    </form>
  );
}

export default UploadForm;
