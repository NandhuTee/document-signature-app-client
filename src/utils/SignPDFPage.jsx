//src/utils/SignPDFPage.jsx
import React, { useState } from 'react';
import SignaturePad from '../components/SignaturePad';
import { addSignatureToPDF } from '../utils/addSignatureToPDF';
import { saveAs } from 'file-saver';

function SignPDFPage() {
  const [file, setFile] = useState(null);
  const [signature, setSignatureData] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSign = async () => {
    const pdfBytes = await file.arrayBuffer();
    const signedPdfBytes = await addSignatureToPDF(pdfBytes, signature);
    saveAs(new Blob([signedPdfBytes]), 'signed.pdf');
  };

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold">🖋️ Sign Your PDF</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <SignaturePad setSignatureData={setSignatureData} />
      {file && signature && (
        <button onClick={handleSign} className="bg-blue-600 text-white px-4 py-2 rounded">
          Sign & Download PDF
        </button>
      )}
    </div>
  );
}

export default SignPDFPage;
