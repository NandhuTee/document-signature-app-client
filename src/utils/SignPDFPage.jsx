import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import './SignPDFPage.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const fonts = [
  'Great Vibes', 'Pacifico', 'Dancing Script',
  'Satisfy', 'Sacramento', 'Allura', 'Alex Brush'
];
const colors = { black: "#000000", blue: "#0000FF", red: "#FF0000", green: "#00AA00" };
const A4_WIDTH = 595.44;
const A4_HEIGHT = 841.68;

const SignPDFPage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [typedSignature, setTypedSignature] = useState("Your Signature");
  const [selectedFont, setSelectedFont] = useState("Allura");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [signatures, setSignatures] = useState([]);
  const pageRef = useRef();

    const handlePDFUpload = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") {
      setPdfFile(file);
      setSignatures([]);
      setCurrentPage(1);
    }
  };

  const handleDocumentLoad = ({ numPages }) => setNumPages(numPages);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("signature", "typed");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = pageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const existing = signatures.find((s) => s.page === currentPage);
    if (existing) return;

    setSignatures((prev) => [
      ...prev,
      {
        id: Date.now(),
        page: currentPage,
        x,
        y,
        width: 150,
        height: 40,
        text: typedSignature,
        font: selectedFont,
        color: selectedColor,
        locked: false,
      },
    ]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const hexToRgb = (hex) => {
    const val = hex.replace("#", "");
    return {
      r: parseInt(val.substring(0, 2), 16),
      g: parseInt(val.substring(2, 4), 16),
      b: parseInt(val.substring(4, 6), 16),
    };
  };

  const generateSignedPDF = async () => {
    if (!pdfFile) return;
    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    for (const sig of signatures) {
      const page = pages[sig.page - 1];
      const { height } = page.getSize();
      const scale = height / A4_HEIGHT;

      const font = await pdfDoc.embedFont(StandardFonts[sig.font] || StandardFonts.Helvetica);
      const color = hexToRgb(sig.color);

      page.drawText(sig.text, {
        x: sig.x * scale,
        y: height - sig.y * scale - sig.height * scale,
        size: 16 * scale,
        font,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
      });
    }

    const finalPdf = await pdfDoc.save();
    const blob = new Blob([finalPdf], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "signed.pdf";
    link.click();
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-6">
      {/* Left Panel */}
      <div className="w-full md:w-1/3 space-y-4">
        <h2 className="text-xl font-bold">Typed Signature</h2>

        <div>
          <label>Upload PDF:</label>
          <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
        </div>

        <div>
          <label>Signature Text:</label>
          <input
            type="text"
            value={typedSignature}
            onChange={(e) => setTypedSignature(e.target.value)}
            className="border p-1 w-full"
          />
        </div>

        <div>
          <label>Font:</label>
          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="border p-1 w-full"
          >
            {fonts.map((font, idx) => (
              <option key={idx} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Color:</label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="border p-1 w-full"
          >
            {Object.entries(colors).map(([name, hex]) => (
              <option key={name} value={hex}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <p>Drag this:</p>
          <div
            draggable
            onDragStart={handleDragStart}
            className="border bg-gray-100 px-2 py-1 inline-block cursor-move"
            style={{
              fontFamily: selectedFont,
              color: selectedColor,
              fontSize: "16px",
            }}
          >
            {typedSignature}
          </div>
        </div>

        <button
          onClick={generateSignedPDF}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download Signed PDF
        </button>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-2/3">
        {pdfFile && (
          <div className="relative">
            {/* Navigation Arrows */}
            <div className="absolute top-2 right-1/2 translate-x-1/2 z-10 flex gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="bg-gray-300 px-2 py-1 rounded disabled:opacity-50"
              >
                ← Prev
              </button>
              <button
                disabled={currentPage >= numPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="bg-gray-300 px-2 py-1 rounded disabled:opacity-50"
              >
                Next →
              </button>
            </div>

            <div
              ref={pageRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                width: A4_WIDTH,
                height: A4_HEIGHT,
                marginTop: 60,
                border: "1px solid #ccc",
                position: "relative",
              }}
            >
              <Document file={pdfFile} onLoadSuccess={handleDocumentLoad}>
                <Page
  pageNumber={currentPage}
  width={A4_WIDTH}
  renderAnnotationLayer={false}
  renderTextLayer={false}
/>

              </Document>

              {signatures
                .filter((s) => s.page === currentPage)
                .map((sig) => (
                  <div
                    key={sig.id}
                   style={{
  position: "absolute",
  left: sig.x,
  top: sig.y,
  width: sig.width,
  height: sig.height,
  fontFamily: sig.font,
  color: sig.color,
  fontSize: "16px",
  border: sig.locked ? "2px dashed gray" : "2px solid blue",
  cursor: sig.locked ? "not-allowed" : "move",
  overflow: "visible",
  padding: "2px",
  zIndex: 1000,
}}

                   onMouseDown={(e) => {
  e.preventDefault(); // important
  e.stopPropagation(); // avoid interfering with drag
  const startX = e.clientX;
  const startY = e.clientY;
  const origW = sig.width;
  const origH = sig.height;

  const resize = (e) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    setSignatures((prev) =>
      prev.map((s) =>
        s.id === sig.id
          ? {
              ...s,
              width: Math.max(50, origW + dx),
              height: Math.max(20, origH + dy),
            }
          : s
      )
    );
  };

  const stopResize = () => {
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
  };

  window.addEventListener("mousemove", resize);
  window.addEventListener("mouseup", stopResize);
}}

                  >
                    {sig.text}

                    {/* Lock/Unlock */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSignatures((prev) =>
                          prev.map((s) =>
                            s.id === sig.id ? { ...s, locked: !s.locked } : s
                          )
                        );
                      }}
                      className="absolute top-[-20px] left-0 text-xs px-1 bg-yellow-500 text-white"
                    >
                      {sig.locked ? "🔓" : "🔒"}
                    </button>

                    {/* Delete */}
                    {!sig.locked && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSignatures((prev) => prev.filter((s) => s.id !== sig.id));
                        }}
                        className="absolute top-[-20px] right-0 bg-red-500 text-white text-xs px-1"
                      >
                        🗑️
                      </button>
                    )}

                    {/* Resize Handle */}
                    {!sig.locked && (
                      <div
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          const startX = e.clientX;
                          const startY = e.clientY;
                          const origW = sig.width;
                          const origH = sig.height;

                          const resize = (e) => {
                            const dx = e.clientX - startX;
                            const dy = e.clientY - startY;
                            setSignatures((prev) =>
                              prev.map((s) =>
                                s.id === sig.id
                                  ? { ...s, width: origW + dx, height: origH + dy }
                                  : s
                              )
                            );
                          };

                          const stopResize = () => {
                            window.removeEventListener("mousemove", resize);
                            window.removeEventListener("mouseup", stopResize);
                          };

                          window.addEventListener("mousemove", resize);
                          window.addEventListener("mouseup", stopResize);
                        }}
className="absolute bottom-0 right-0 w-4 h-4 bg-blue-600 cursor-nwse-resize z-50"
                      ></div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignPDFPage;