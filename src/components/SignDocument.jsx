import React, { useRef, useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';

const fonts = [
  'Great Vibes', 'Pacifico', 'Dancing Script', 'Satisfy', 'Sacramento', 'Allura', 'Alex Brush'
];

function SignDocument() {
  const [name, setName] = useState('');
  const [font, setFont] = useState('Great Vibes');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const previewRef = useRef();

  const handleSign = async () => {
    if (!file || !name) {
      setMessage("❗ Please upload a PDF and enter your name.");
      return;
    }

    try {
      // Capture typed signature as image
      const dataUrl = await htmlToImage.toPng(previewRef.current);

      const pdfBytes = new Uint8Array(await file.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const pngImage = await pdfDoc.embedPng(dataUrl);
      const dims = pngImage.scale(0.5);

      firstPage.drawImage(pngImage, {
        x: 50,
        y: 100,
        width: dims.width,
        height: dims.height,
      });

      const signedPdfBytes = await pdfDoc.save();
      saveAs(new Blob([signedPdfBytes]), 'signed-document.pdf');
      setMessage("✅ Document signed and downloaded!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error signing document.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-50 shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">🖋️ Sign Your PDF</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 w-full border p-2"
      />

      <input
        type="text"
        placeholder="Type your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      <select
        value={font}
        onChange={(e) => setFont(e.target.value)}
        className="w-full border p-2 mb-4"
      >
        {fonts.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      <p className="mb-4">🖌️ Preview:</p>
      <div
        ref={previewRef}
        className="text-center text-3xl font-semibold border py-4 bg-white"
        style={{ fontFamily: font }}
      >
        {name}
      </div>

      <button
        onClick={handleSign}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full mt-4"
      >
        Sign & Download PDF
      </button>

      {message && <p className="mt-4 text-center text-green-700">{message}</p>}
    </div>
  );
}

export default SignDocument;
