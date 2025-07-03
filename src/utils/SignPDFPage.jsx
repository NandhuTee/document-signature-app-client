// File: SignPDFPage.jsx

import React, { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';
import Draggable from 'react-draggable';

const fonts = [
  'Great Vibes', 'Pacifico', 'Dancing Script',
  'Satisfy', 'Sacramento', 'Allura', 'Alex Brush'
];

const colors = {
  black: '#000000',
  blue: '#0000FF',
  red: '#FF0000',
  green: '#00AA00',
};

function SignPDFPage() {
  const [name, setName] = useState('Your Name');
  const [font, setFont] = useState(fonts[0]);
  const [color, setColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(32);
  const [file, setFile] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [signatures, setSignatures] = useState([]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPdfPreviewUrl(url);
    setPageNumber(1);
    setSignatures([]);

    const arrayBuffer = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    setPageCount(pdfDoc.getPages().length);
  };

  const handleAddSignature = () => {
    setSignatures([
      ...signatures,
      {
        id: Date.now(),
        name,
        font,
        color,
        fontSize,
        position: { x: 100, y: 100 },
        page: pageNumber,
      }
    ]);
  };

  const handleDrag = (id, data) => {
    setSignatures((prev) =>
      prev.map((sig) =>
        sig.id === id ? { ...sig, position: { x: data.x, y: data.y } } : sig
      )
    );
  };

  const handleDownload = async () => {
    if (!file) return alert("Upload a PDF first");

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    for (const sig of signatures) {
      const page = pages[sig.page - 1];
      const renderId = `sig-render-${sig.id}`;
      const node = document.getElementById(renderId);
      const dataUrl = await htmlToImage.toPng(node);
      const pngImage = await pdfDoc.embedPng(dataUrl);
      const dims = pngImage.scale(0.5);

      const pageHeight = page.getHeight();
      const yPDF = pageHeight - sig.position.y - dims.height;

      page.drawImage(pngImage, {
        x: sig.position.x,
        y: yPDF,
        width: dims.width,
        height: dims.height,
      });
    }

    const finalPdf = await pdfDoc.save();
    saveAs(new Blob([finalPdf], { type: 'application/pdf' }), 'signed.pdf');
  };

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">🖋️ PDF Signature Tool</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="border p-2 w-full"
      />

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type your name"
        className="border p-2 w-full"
        style={{ fontFamily: font }}
      />

      <div className="flex gap-2">
        <select value={font} onChange={(e) => setFont(e.target.value)} className="border p-2 w-full">
          {fonts.map(f => (
            <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
          ))}
        </select>

        <select value={color} onChange={(e) => setColor(e.target.value)} className="border p-2">
          {Object.entries(colors).map(([name, val]) => (
            <option key={name} value={val}>{name}</option>
          ))}
        </select>

        <input
          type="number"
          min="10"
          max="100"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="border p-2 w-20"
        />
      </div>

      <div className="flex items-center gap-2">
        <label>🗂️ Page #</label>
        <input
          type="number"
          min="1"
          max={pageCount}
          value={pageNumber}
          onChange={(e) => setPageNumber(Number(e.target.value))}
          className="border p-2 w-20"
        />
      </div>

      <div
        className="relative border shadow bg-white overflow-hidden"
        style={{ width: '595px', height: '842px', position: 'relative' }}
      >
        {pdfPreviewUrl && (
          <iframe
            src={`${pdfPreviewUrl}#page=${pageNumber}&toolbar=0&navpanes=0&scrollbar=0`}
            className="absolute top-0 left-0 w-full h-full"
            title="PDF Preview"
          />
        )}

        {signatures
          .filter(sig => sig.page === pageNumber)
          .map(sig => (
            <Draggable
              key={sig.id}
              onDrag={(_, data) => handleDrag(sig.id, data)}
              position={sig.position}
            >
              <div
                id={`sig-${sig.id}`}
                style={{
                  fontFamily: sig.font,
                  fontSize: `${sig.fontSize}px`,
                  color: sig.color,
                  background: 'transparent',
                  position: 'absolute',
                  cursor: 'move',
                  pointerEvents: 'auto',
                }}
              >
                {sig.name}
              </div>
            </Draggable>
          ))}
      </div>

      <div className="flex gap-4">
        <button onClick={handleAddSignature} className="bg-green-600 text-white px-4 py-2 rounded">
          ➕ Add Signature
        </button>
        <button onClick={handleDownload} className="bg-blue-600 text-white px-4 py-2 rounded">
          📥 Download Signed PDF
        </button>
      </div>

      {signatures.length > 0 && (
        <p className="text-sm text-gray-500">
          🖱️ Drag each signature to the correct spot before downloading.
        </p>
      )}

      {/* Invisible offscreen render for html-to-image */}
      <div style={{ position: 'absolute', top: -9999, left: -9999 }}>
        {signatures.map(sig => (
          <div
            key={sig.id}
            id={`sig-render-${sig.id}`}
            style={{
              fontFamily: sig.font,
              fontSize: `${sig.fontSize}px`,
              color: sig.color,
              background: 'transparent',
              width: 'max-content',
              padding: 2
            }}
          >
            {sig.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SignPDFPage;
