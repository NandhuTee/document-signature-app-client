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
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const previewRef = useRef();
  const pdfCanvasRef = useRef();

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPdfPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSign = async () => {
    if (!file) return alert("Please upload a PDF");

    const pdfBytes = new Uint8Array(await file.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pngDataUrl = await htmlToImage.toPng(previewRef.current);
    const pngImage = await pdfDoc.embedPng(pngDataUrl);
    const dims = pngImage.scale(0.5);

    const page = pdfDoc.getPages()[0];
    const canvasRect = pdfCanvasRef.current.getBoundingClientRect();

    const x = position.x;
    const y = canvasRect.height - position.y - dims.height;

    page.drawImage(pngImage, {
      x,
      y,
      width: dims.width,
      height: dims.height,
    });

    const signedPdfBytes = await pdfDoc.save();
    saveAs(new Blob([signedPdfBytes]), 'signed.pdf');
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
      />

      <select
        value={font}
        onChange={(e) => setFont(e.target.value)}
        className="border p-2 w-full"
      >
        {fonts.map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      {/* Preview Canvas */}
      <div
        className="relative border bg-gray-100 overflow-hidden"
        ref={pdfCanvasRef}
        style={{ width: '600px', height: '400px' }}
      >
        {pdfPreviewUrl && (
          <iframe
            src={pdfPreviewUrl + "#toolbar=0&navpanes=0&scrollbar=0"}
            className="absolute top-0 left-0 w-full h-full"
            title="PDF Preview"
          />
        )}

        <Draggable onDrag={handleDrag} position={position}>
          <div
            ref={previewRef}
            style={{
              fontFamily: font,
              fontSize: '32px',
              cursor: 'move',
              position: 'absolute',
              background: 'transparent',
              color: 'black'
            }}
          >
            {name}
          </div>
        </Draggable>
      </div>

      <p className="text-gray-500 text-sm">🖱️ Drag your signature on the preview and click below to embed it.</p>

      <button
        onClick={handleSign}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Sign & Download PDF
      </button>
    </div>
  );
}

export default TypedSignatureDrag;
