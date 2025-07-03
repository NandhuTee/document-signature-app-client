// src/components/Dashboard.jsx
import React from 'react';
import DocumentList from './DocumentList';
import UploadForm from './UploadForm';
import { useNavigate } from 'react-router-dom'; // ✅ import hook

function Dashboard() {
  const navigate = useNavigate(); // ✅ initialize navigate

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-4">🧾 Your Dashboard</h2>
      
      <UploadForm />
      <DocumentList />

      {/* ✅ Button to go to signature page */}
         <div className="p-6 space-y-4">
      {/* Other dashboard content */}

      <button
        onClick={() => navigate('/typed-signature')}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        ➕ Create Typed Signature
      </button>
    </div>
    </div>
  );
}

export default Dashboard;
