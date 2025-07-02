// src/pages/SignPage.jsx (or any component)
import React, { useState } from 'react';
import SignaturePad from '../components/SignaturePad';

const SignPage = () => {
  const [signatureImage, setSignatureImage] = useState(null);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Draw Your Signature</h2>
      <SignaturePad setSignatureImage={setSignatureImage} />
      
      {signatureImage && (
        <div className="mt-4">
          <p className="font-semibold">Preview:</p>
          <img src={signatureImage} alt="Signature Preview" className="border p-2" />
        </div>
      )}
    </div>
  );
};

export default SignPage;
