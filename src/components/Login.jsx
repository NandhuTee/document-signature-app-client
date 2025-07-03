//src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://document-signature-app-server-zp95.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      alert('Login success!');
      navigate('/upload');
    } else {
      alert(data.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-semibold text-center">Login</h2>
      <input type="email" name="email" placeholder="Email" className="w-full p-2 border" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" className="w-full p-2 border" onChange={handleChange} required />
      <button className="w-full p-2 bg-green-600 text-white">Login</button>
    </form>
  );
}

export default Login;
