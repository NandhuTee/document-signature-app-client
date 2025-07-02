import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://document-signature-app-server-zp95.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      alert('Registered successfully!');
      navigate('/login');
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-semibold text-center">Register</h2>
      <input type="text" name="name" placeholder="Name" className="w-full p-2 border" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" className="w-full p-2 border" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" className="w-full p-2 border" onChange={handleChange} required />
      <button className="w-full p-2 bg-blue-600 text-white">Register</button>
    </form>
  );
}

export default Register;
