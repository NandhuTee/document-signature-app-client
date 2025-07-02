import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UploadForm from './components/UploadForm';
import DocumentList from './components/DocumentList';

function App() {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/upload" /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/docs" element={<DocumentList />} />
        <Route path="*" element={<h1 className="text-center text-2xl text-red-600">404 - Page Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
