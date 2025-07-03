import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // 👈 Check if user is signed in

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">📄 Document Signature App</div>
      <div className="space-x-4">
        <Link to="/upload" className="hover:text-yellow-300">Upload</Link>
        <Link to="/documents" className="hover:text-yellow-300">Dashboard</Link>

        {token && (
          <>
            <Link to="/sign-pdf" className="hover:text-yellow-300">Typed Sign</Link>
            <Link to="/sign-image" className="hover:text-yellow-300">Image Sign</Link>
            <Link to="/sign-draw" className="hover:text-yellow-300">Draw Sign</Link>
          </>
        )}

        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
