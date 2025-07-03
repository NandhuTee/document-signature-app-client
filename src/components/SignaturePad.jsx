//src/components/SignaturePad.jsx
import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

function SignaturePad({ setSignatureData }) {
  const sigCanvas = useRef();

  const clear = () => sigCanvas.current.clear();
  const save = () => {
    const dataUrl = sigCanvas.current.toDataURL();
    setSignatureData(dataUrl); // send dataURL to parent
  };

  return (
    <div className="flex flex-col items-center space-y-2 p-4 bg-gray-100 rounded-md shadow">
      <SignatureCanvas
        penColor="black"
        canvasProps={{ width: 400, height: 150, className: 'bg-white border rounded' }}
        ref={sigCanvas}
      />
      <div className="space-x-2">
        <button onClick={clear} className="px-3 py-1 bg-red-500 text-white rounded">Clear</button>
        <button onClick={save} className="px-3 py-1 bg-green-500 text-white rounded">Save Signature</button>
      </div>
    </div>
  );
}

export default SignaturePad;
