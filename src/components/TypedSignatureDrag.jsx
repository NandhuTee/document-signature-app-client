import React, { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';
import Draggable from 'react-draggable';

const fonts = [
  'Great Vibes', 'Pacifico', 'Dancing Script',
  'Satisfy', 'Sacramento', 'Allura', 'Alex Brush'
];

function TypedSignatureDrag() {
  const [name, setName] = useState('Your Name');
  const [font, setFont] = useState(fonts[0]);
  const [file, setFile] = useState(null);
  const [signatureAdded, setSignatureAdded] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const previewRef = useRef();
  const canvasRef = useRef();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setSignatureAdded(false); // Reset
  };

  const handleDrag = (_, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleAddSignature = () => setSignatureAdded(true);

  const handleDownload = async () => {
    if (!file || !signatureAdded) return alert("Upload PDF and add signature first.");

    // Ensure font is loaded
    if ('fonts' in document) {
      await document.fonts.load(`32px '${font}'`);
      await document.fonts.ready;
    }

    const pngDataUrl = await htmlToImage.toPng(canvasRef.current);
    const pdfBytes = new Uint8Array(await file.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pngImage = await pdfDoc.embedPng(pngDataUrl);
    const dims = pngImage.scale(0.5);

    const page = pdfDoc.getPages()[0];
    const yFlipped = canvasRef.current.clientHeight - position.y - dims.height;

    page.drawImage(pngImage, {
      x: position.x,
      y: yFlipped,
      width: dims.width,
      height: dims.height
    });

    const finalPdf = await pdfDoc.save();
    saveAs(new Blob([finalPdf]), 'signed.pdf');
  };

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">🖋️ Typed Signature Placement</h2>

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
        className="border p-2 w-full"
        placeholder="Type your name"
        style={{ fontFamily: font }}
      />

      <select
        value={font}
        onChange={(e) => setFont(e.target.value)}
        className="border p-2 w-full"
      >
        {fonts.map(f => (
          <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
        ))}
      </select>

      <div
        ref={canvasRef}
        className="relative border bg-gray-100 overflow-hidden"
        style={{ width: '600px', height: '400px' }}
      >
        <p className="absolute top-1 left-1 text-sm text-gray-500 z-0">📝 Document Preview Area</p>

        {signatureAdded && (
          <Draggable onDrag={handleDrag} position={position}>
            <div
              ref={previewRef}
              style={{
                fontFamily: font,
                fontSize: '32px',
                cursor: 'move',
                background: 'transparent',
                color: 'black',
                position: 'absolute'
              }}
            >
              {name}
            </div>
          </Draggable>
        )}
      </div>

      <div className="flex gap-4">
        {!signatureAdded && (
          <button
            onClick={handleAddSignature}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            ➕ Add Signature
          </button>
        )}

        {signatureAdded && (
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            📥 Download Signed PDF
          </button>
        )}
      </div>

      {signatureAdded && (
        <p className="text-sm text-gray-500">
          🖱️ Drag your signature on the preview area before downloading.
        </p>
      )}
    </div>
  );
}

export default TypedSignatureDrag;
