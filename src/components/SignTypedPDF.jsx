//src/components/SignTypedPDF.jsx
import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

function SignTypedPDF() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [selectedFont, setSelectedFont] = useState('Great Vibes');

  const fonts = ['Great Vibes', 'Pacifico', 'Dancing Script'];

  const handleSign = async () => {
    if (!file || !name) return alert('Please upload a file and enter your name');

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const pdfDoc = await PDFDocument.load(reader.result);
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();

      // Use default font from pdf-lib since custom Google fonts can't be embedded easily
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 24;

      page.drawText(name, {
        x: 50,
        y: 100,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      saveAs(new Blob([pdfBytes]), 'signed-document.pdf');
    };
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">🖋️ Type Your Signature</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="border px-3 py-2 w-full mb-4"
      />

      <div className="mb-4">
        <label className="block font-medium mb-2">Select Style:</label>
        <div className="flex flex-wrap gap-2">
          {fonts.map((fontName) => (
            <button
              key={fontName}
              style={{ fontFamily: fontName }}
              onClick={() => setSelectedFont(fontName)}
              className={`px-4 py-2 border ${
                selectedFont === fontName ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {fontName}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSign}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        ➕ Add Signature & Download
      </button>
    </div>
  );
}

export default SignTypedPDF;
