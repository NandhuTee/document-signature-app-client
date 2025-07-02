// src/components/SignaturePad.jsx
import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = ({ setSignatureImage }) => {
  const sigCanvas = useRef();

  const clear = () => sigCanvas.current.clear();

  const save = () => {
    const imageData = sigCanvas.current.toDataURL(); // base64 image
    setSignatureImage(imageData); // Send image back to parent
  };

  return (
    <div className="flex flex-col items-center">
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{
          width: 400,
          height: 150,
          className: "border border-gray-300 rounded"
        }}
      />
      <div className="mt-2 space-x-4">
        <button onClick={clear} className="px-3 py-1 bg-red-600 text-white rounded">Clear</button>
        <button onClick={save} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
      </div>
    </div>
  );
};

export default SignaturePad;
