// src/components/Home.jsx
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold mb-6">Welcome to Document Signature App</h1>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Login</Link>
        <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Register</Link>
      </div>
    </div>
  );
}

export default Home;
