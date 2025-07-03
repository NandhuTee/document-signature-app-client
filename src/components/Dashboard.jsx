//src/components/Dashboard.jsx
import React from 'react';
import DocumentList from './DocumentList';
import UploadForm from './UploadForm';

function Dashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-4">🧾 Your Dashboard</h2>
      <UploadForm />
      <DocumentList />
    </div>
  );
}

export default Dashboard;
