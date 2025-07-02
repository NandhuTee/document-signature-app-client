// src/components/SignPdf.jsx
import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import SignaturePad from './SignaturePad';

const SignPdf = () => {
  const [signatureImage, setSignatureImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSign = async () => {
    if (!selectedFile || !signatureImage) return;

    const fileBytes = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBytes);
    const page = pdfDoc.getPages()[0];

    const pngImage = await pdfDoc.embedPng(signatureImage);
    const { width, height } = pngImage.scale(0.5);

    // Change x, y for signature position
    page.drawImage(pngImage, {
      x: 50,
      y: 50,
      width,
      height,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'signed-document.pdf');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload PDF & Sign</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="mb-4"
      />

      <SignaturePad setSignatureImage={setSignatureImage} />

      <button onClick={handleSign} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Sign & Download PDF
      </button>
    </div>
  );
};

export default SignPdf;
