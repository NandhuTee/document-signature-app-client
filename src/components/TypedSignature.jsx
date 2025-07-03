// src/components/TypedSignature.jsx
import React, { useState } from 'react';

const fontOptions = [
  { label: 'Great Vibes', value: 'Great Vibes, cursive' },
  { label: 'Sacramento', value: 'Sacramento, cursive' },
  { label: 'Pacifico', value: 'Pacifico, cursive' },
  { label: 'Satisfy', value: 'Satisfy, cursive' },
  { label: 'Dancing Script', value: 'Dancing Script, cursive' },
  { label: 'Allura', value: 'Allura, cursive' },
  { label: 'Alex Brush', value: 'Alex Brush, cursive' },
];

const TypedSignature = ({ onSignatureGenerate }) => {
  const [name, setName] = useState('Your Name');
  const [font, setFont] = useState(fontOptions[0].value);

  const handleGenerate = () => {
    onSignatureGenerate({ name, font });
  };

  return (
    <div className="p-6 bg-gray-100 rounded shadow space-y-4 max-w-xl mx-auto">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded"
        placeholder="Enter your name"
      />

     <select
  value={font}
  onChange={(e) => setFont(e.target.value)}
  className="border p-2 w-full rounded"
>
  {fontOptions.map((f) => (
    <option key={f.label} value={f.value} style={{ fontFamily: f.value }}>
      {f.label}
    </option>
  ))}
</select>

<div className="border p-4 rounded bg-white text-center">
  <p style={{ fontFamily: font, fontSize: '2.5rem' }}>{name}</p>
</div>


      <button onClick={handleGenerate} className="bg-blue-500 text-white px-4 py-2 rounded">
        Use This Signature
      </button>
    </div>
  );
};

export default TypedSignature;
