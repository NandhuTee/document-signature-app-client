import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";
import { useEffect } from "react";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const A4_WIDTH = 595.44;
const A4_HEIGHT = 841.68;

const SignDrawPage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawColor, setDrawColor] = useState("#000000");
  const [drawnSignURL, setDrawnSignURL] = useState(null);
  const [signatures, setSignatures] = useState([]);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const pageRef = useRef();

  

useEffect(() => {
  prepareCanvas();
}, [drawColor]);


  const handlePDFUpload = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") {
      setPdfFile(file);
      setSignatures([]);
      setCurrentPage(1);
    }
  };

  const handleDocumentLoad = ({ numPages }) => {
    setNumPages(numPages);
  };

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = 300;
    canvas.height = 150;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctxRef.current = ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (e) => {
    drawing.current = true;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!drawing.current) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    drawing.current = false;
    const canvas = canvasRef.current;
    const url = canvas.toDataURL("image/png");
    setDrawnSignURL(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!drawnSignURL) {
      alert("Please draw your signature first.");
      return;
    }

    const rect = pageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSignatures((prev) => [
      ...prev,
      {
        id: Date.now(),
        page: currentPage,
        x,
        y,
        width: 150,
        height: 50,
        locked: false,
        image: drawnSignURL,
      },
    ]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const generateSignedPDF = async () => {
    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    for (const sig of signatures) {
      const page = pages[sig.page - 1];
      const pageHeight = page.getHeight();

      const imgBytes = await fetch(sig.image).then((res) => res.arrayBuffer());
      const img = await pdfDoc.embedPng(imgBytes);

      page.drawImage(img, {
        x: sig.x,
        y: pageHeight - sig.y - sig.height,
        width: sig.width,
        height: sig.height,
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
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Left Panel */}
      <div className="w-full md:w-1/3 space-y-4">
        <h2 className="text-xl font-bold">Draw Signature</h2>

        <div>
          <label>Upload PDF:</label>
          <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
        </div>

        <div>
          <label>Draw Color:</label>
          <input
            type="color"
            value={drawColor}
            onChange={(e) => setDrawColor(e.target.value)}
          />
        </div>

        <div>
          <p>Draw your signature:</p>
          <canvas
            ref={canvasRef}
            className="border cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            
          />
        </div>

        {drawnSignURL && (
          <div>
            <p>Drag this signature:</p>
            <img
              src={drawnSignURL}
              draggable
              style={{ width: 150, cursor: "grab" }}
              onDragStart={(e) => {
  e.dataTransfer.setData("text/plain", "drawn-signature");
}}

              alt="Drawn Signature"
            />
          </div>
        )}
      <button
  onClick={prepareCanvas}
  className="bg-red-500 text-white px-3 py-1 rounded"
>
  Clear Signature
</button>

        <button
          onClick={generateSignedPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download Signed PDF
        </button>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-2/3">
        {pdfFile && (
          <div className="relative">
            {/* Navigation */}
            <div className="absolute top-0 right-0 z-10 flex gap-2">
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
                marginTop: 40,
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
                      border: sig.locked ? "2px dashed gray" : "2px solid blue",
                      cursor: sig.locked ? "not-allowed" : "move",
                      backgroundColor: "transparent",
                    }}
                    onMouseDown={(e) => {
                      if (sig.locked) return;
                      const startX = e.clientX;
                      const startY = e.clientY;
                      const origX = sig.x;
                      const origY = sig.y;

                      const move = (e) => {
                        const dx = e.clientX - startX;
                        const dy = e.clientY - startY;
                        setSignatures((prev) =>
                          prev.map((s) =>
                            s.id === sig.id ? { ...s, x: origX + dx, y: origY + dy } : s
                          )
                        );
                      };

                      const up = () => {
                        window.removeEventListener("mousemove", move);
                        window.removeEventListener("mouseup", up);
                      };

                      window.addEventListener("mousemove", move);
                      window.addEventListener("mouseup", up);
                    }}
                  >
                    <img
                      src={sig.image}
                      alt="Signature"
                      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
                    />

                    {/* Lock / Unlock */}
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

                    {/* Resize */}
                    {!sig.locked && (
                      <div
                        className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-nwse-resize"
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

export default SignDrawPage;
