import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const A4_WIDTH = 595.44;
const A4_HEIGHT = 841.68;

const SignImagePage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setSignatureImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentLoad = ({ numPages }) => setNumPages(numPages);

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = pageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const alreadyPlaced = signatures.find((s) => s.page === currentPage);
    if (alreadyPlaced) return;

    setSignatures((prev) => [
      ...prev,
      {
        id: Date.now(),
        page: currentPage,
        x,
        y,
        width: 100,
        height: 40,
        locked: false,
      },
    ]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDragStart = (e) => {
    e.dataTransfer.setData("signature", "drag-image");
  };

  const generateSignedPDF = async () => {
    if (!pdfFile || !signatureImage) return;

    const existingPdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pngImage = await pdfDoc.embedPng(signatureImage);
    const pages = pdfDoc.getPages();

    for (const sig of signatures) {
      const pageIndex = sig.page - 1;
      const page = pages[pageIndex];
      const { height } = page.getSize();
      const scale = height / A4_HEIGHT;

      page.drawImage(pngImage, {
        x: sig.x * scale,
        y: height - sig.y * scale - sig.height * scale,
        width: sig.width * scale,
        height: sig.height * scale,
      });
    }

    const signedBytes = await pdfDoc.save();
    const blob = new Blob([signedBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "signed.pdf";
    link.click();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* LEFT PANEL */}
      <div className="w-full md:w-1/3 space-y-4">
        <h2 className="text-xl font-bold">PDF Signer</h2>

        <div>
          <label className="font-semibold">Upload PDF:</label>
          <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
        </div>

        <div>
          <label className="font-semibold">Upload Signature Image:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        {signatureImage && (
          <div>
            <p className="mt-2">Drag this →</p>
            <img
              src={signatureImage}
              draggable
              onDragStart={handleDragStart}
              alt="Signature"
              className="w-[100px] h-[40px] mt-2 border shadow"
            />
          </div>
        )}

        <button
          onClick={generateSignedPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-6"
        >
          Download Signed PDF
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-2/3">
        {pdfFile && (
          <div className="relative">
            {/* Prev/Next */}
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

            {/* PDF Viewer */}
            <div
              ref={pageRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                width: `${A4_WIDTH}px`,
                height: `${A4_HEIGHT}px`,
                position: "relative",
                border: "1px solid #ccc",
                marginTop: "60px",
                overflow: "hidden",
              }}
            >
              <Document file={pdfFile} onLoadSuccess={handleDocumentLoad}>
                <Page pageNumber={currentPage} width={A4_WIDTH} />
              </Document>

              {signatures
                .filter((sig) => sig.page === currentPage)
                .map((sig) => (
                  <div
                    key={sig.id}
                    style={{
                      position: "absolute",
                      left: sig.x,
                      top: sig.y,
                      width: sig.width,
                      height: sig.height,
                      border: sig.locked
                        ? "2px dashed gray"
                        : "2px solid blue",
                      cursor: sig.locked ? "not-allowed" : "move",
                      zIndex: 10,
                    }}
                    onMouseDown={(e) => {
                      if (sig.locked) return;
                      const startX = e.clientX;
                      const startY = e.clientY;
                      const origX = sig.x;
                      const origY = sig.y;

                      const moveHandler = (moveEvent) => {
                        const dx = moveEvent.clientX - startX;
                        const dy = moveEvent.clientY - startY;
                        setSignatures((prev) =>
                          prev.map((s) =>
                            s.id === sig.id
                              ? { ...s, x: origX + dx, y: origY + dy }
                              : s
                          )
                        );
                      };

                      const upHandler = () => {
                        window.removeEventListener("mousemove", moveHandler);
                        window.removeEventListener("mouseup", upHandler);
                      };

                      window.addEventListener("mousemove", moveHandler);
                      window.addEventListener("mouseup", upHandler);
                    }}
                  >
                    <img
                      src={signatureImage}
                      style={{
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                      }}
                      draggable={false}
                      alt="signature"
                    />

                    {/* LOCK / UNLOCK */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSignatures((prev) =>
                          prev.map((s) =>
                            s.id === sig.id
                              ? { ...s, locked: !s.locked }
                              : s
                          )
                        );
                      }}
                      className={`absolute top-[-20px] left-0 text-white text-xs px-1 ${
                        sig.locked ? "bg-green-600" : "bg-yellow-500"
                      }`}
                    >
                      {sig.locked ? "🔓" : "🔒"}
                    </button>

                    {/* DELETE */}
                    {!sig.locked && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSignatures((prev) =>
                            prev.filter((s) => s.id !== sig.id)
                          );
                        }}
                        className="absolute top-[-20px] right-0 bg-red-500 text-white text-xs px-1"
                      >
                        🗑️
                      </button>
                    )}

                    {/* RESIZE */}
                    {!sig.locked && (
                      <div
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          const startX = e.clientX;
                          const startY = e.clientY;
                          const origW = sig.width;
                          const origH = sig.height;

                          const resizeMove = (moveEvent) => {
                            const dx = moveEvent.clientX - startX;
                            const dy = moveEvent.clientY - startY;
                            setSignatures((prev) =>
                              prev.map((s) =>
                                s.id === sig.id
                                  ? {
                                      ...s,
                                      width: Math.max(30, origW + dx),
                                      height: Math.max(15, origH + dy),
                                    }
                                  : s
                              )
                            );
                          };

                          const resizeUp = () => {
                            window.removeEventListener(
                              "mousemove",
                              resizeMove
                            );
                            window.removeEventListener("mouseup", resizeUp);
                          };

                          window.addEventListener("mousemove", resizeMove);
                          window.addEventListener("mouseup", resizeUp);
                        }}
                        className="absolute bottom-0 right-0 w-3 h-3 bg-black cursor-se-resize"
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

export default SignImagePage;
