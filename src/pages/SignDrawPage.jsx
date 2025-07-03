import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const SignDrawPage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [signature, setSignature] = useState("Your Signature");
  const [position, setPosition] = useState(null); // { x, y, renderedHeight }

  const pageRef = useRef();

  const onPDFUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPosition(null);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleClickPDF = (e) => {
    const rect = pageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const height = rect.height;

    setPosition({ x, y, renderedHeight: height });
  };

  const generateSignedPDF = async () => {
    if (!pdfFile || !position) return;

    const existingPdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const { height: pdfHeight } = page.getSize();
      const scale = pdfHeight / position.renderedHeight;
      const yInPDF = pdfHeight - position.y * scale - 16;

      page.drawText(signature, {
        x: position.x,
        y: yInPDF,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const signedPdfBytes = await pdfDoc.save();
    const blob = new Blob([signedPdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "signed.pdf";
    link.click();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Left Panel: Controls */}
      <div className="w-full md:w-1/3 space-y-4">
        <h1 className="text-xl font-bold">🖋️ PDF Signer</h1>
        <input type="file" accept="application/pdf" onChange={onPDFUpload} />
        <input
          type="text"
          placeholder="Your Signature"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          className="border p-2 w-full"
        />
        <p className="text-sm text-gray-600">
          Click on the PDF to place signature. It will be added to all pages.
        </p>
        <button
          onClick={generateSignedPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download Signed PDF
        </button>
      </div>

      {/* Right Panel: PDF Preview */}
      <div
        ref={pageRef}
        className="w-full md:w-2/3 border relative"
        style={{ cursor: "crosshair" }}
        onClick={handleClickPDF}
      >
        {pdfFile ? (
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<p className="p-4">Loading PDF...</p>}
          >
            {/* A4 width: 595.28px (standard), set height proportionally */}
            <Page pageNumber={1} width={595.28} />
            {position && (
              <div
                style={{
                  position: "absolute",
                  left: position.x,
                  top: position.y,
                  fontSize: "16px",
                  fontFamily: "Helvetica",
                  color: "black",
                  pointerEvents: "none",
                }}
              >
                {signature}
              </div>
            )}
          </Document>
        ) : (
          <p className="p-4 text-gray-500">Upload a PDF to begin.</p>
        )}
      </div>
    </div>
  );
};

export default SignDrawPage;
