// src/components/SignAndDownload.jsx
import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

function SignAndDownload() {
  const sigPadRef = useRef();
  const [pdfFile, setPdfFile] = useState(null);

  const handlePdfUpload = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSign = async () => {
    if (!pdfFile) return alert("Upload a PDF first");

    const signatureImage = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
    const existingPdfBytes = await pdfFile.arrayBuffer();

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];

    const pngImage = await pdfDoc.embedPng(signatureImage);
    const pngDims = pngImage.scale(0.5);

    page.drawImage(pngImage, {
      x: 50,
      y: 50,
      width: pngDims.width,
      height: pngDims.height,
    });

    const signedPdfBytes = await pdfDoc.save();
    saveAs(new Blob([signedPdfBytes]), 'signed-document.pdf');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🖋️ Sign and Download PDF</h2>

      <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="mb-4" />

      <SignatureCanvas
        ref={sigPadRef}
        penColor="black"
        canvasProps={{ width: 400, height: 200, className: "border border-gray-500 mb-4" }}
      />

      <div className="space-x-2">
        <button onClick={() => sigPadRef.current.clear()} className="bg-red-500 text-white px-4 py-1 rounded">Clear</button>
        <button onClick={handleSign} className="bg-blue-600 text-white px-4 py-1 rounded">Sign & Download</button>
      </div>
    </div>
  );
}

export default SignAndDownload;
