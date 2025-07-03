//src/utils/addSignatureToPDF.js

import { PDFDocument, rgb } from 'pdf-lib';

export async function addSignatureToPDF(pdfBytes, signatureDataUrl) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[0];

  const pngImage = await pdfDoc.embedPng(signatureDataUrl);
  const pngDims = pngImage.scale(0.5);

  // Position bottom right
  page.drawImage(pngImage, {
    x: page.getWidth() - pngDims.width - 50,
    y: 50,
    width: pngDims.width,
    height: pngDims.height,
  });

  const modifiedPdfBytes = await pdfDoc.save();
  return modifiedPdfBytes;
}
