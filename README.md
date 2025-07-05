# document-signature-app-client
# ✨ Frontend Documentation – Document Signature App (DocuSign Clone)
## 🚀 Demo

🎥 **Live Walkthrough Video:**  
[Watch on YouTube](https://youtu.be/L6ICjY2nHNU)

📁 **Downloadable Demo Video:**  
[Google Drive Link](https://drive.google.com/file/d/1xPL1hyfs-KzG7AL8KPRKS6O4HoD9DAiR/view?usp=sharing)

🧪 **Live App:**  
[Click to View the Deployed App](https://document-signature-app-client.vercel.app)

## 🖥 Tech Stack

| Technology | Purpose |
| --- | --- |
| React.js | Frontend framework |
| Tailwind CSS | Styling |
| React-Router | Navigation between pages |
| React-PDF | Rendering PDF files in browser |
| pdf-lib | Embedding signature into PDFs |
| html-to-image | (Optional) Convert signature area to image |
| Google Fonts | Custom font styles for typed signatures |

## 🔑 Features (Frontend)

| Feature | Description |
| --- | --- |
| PDF Upload & Preview | Upload PDF file, preview with full A4 size using React-PDF |
| Typed Signature | User can type their signature, choose font and color |
| Image Signature | Upload and drag signature image onto specific pages |
| Draw Signature | (Optional) Use canvas to draw custom signature |
| Drag & Drop Signatures | Place signatures anywhere on the page |
| Resize & Lock Signatures | Resize, lock position, or delete signature before saving |
| Paginated View | Navigate pages with previous/next arrows |
| Save & Download Signed PDF | Signatures are embedded into exact positions using pdf-lib |

## 🖋 Signature Handling

### 🅰 Typed Signature

*   User types signature → selects font & color.
*   Signature preview is draggable.
*   Can be locked, deleted, and resized.

### 🅱 Image Signature

*   Upload image → displayed on left panel.
*   User drags image to specific page location.
*   Image is resized, locked/unlocked, or deleted.

### 🅲 Position & Size Storage

*   Each signature has:

js

CopyEdit

{

id, text/image,

page, x, y,

width, height,

font, color,

locked

}

## 📐 PDF Preview

*   A4 Size: 595.44 x 841.68 units
*   Each page is rendered using react-pdf
*   Signature coordinates are scaled accordingly when embedding

## 📥 Download Functionality

*   Uses pdf-lib to embed:
    *   Text for typed signatures
    *   Images for image signatures
*   Coordinates are converted to match the PDF's native scale
*   Generates final blob and triggers download

## 🔍 Pages/Routes

| Path | Page |
| --- | --- |
| /upload | Upload PDF |
| /documents | Dashboard |
| /sign-pdf | Typed Signature Page |
| /sign-image | Image Signature Page |
| /sign-draw | Draw Signature Page |
| /login | (Optional Auth) |

## 🚀 User Flow

1.  **Upload PDF**
2.  **Select signature method (typed/image/draw)**
3.  **Place signature(s) on desired pages**
4.  **Lock/Resize/Delete if needed**
5.  **Download final signed PDF**

## ✅ UI Enhancements

*   100% A4 size preview
*   Fixed preview position (right side)
*   Page navigation arrows
*   Drag-and-drop interface
*   Font and color customization
*   Responsive layout using Tailwind CSS

**🔧 Key Techniques and Libraries Used**

| 📌 Technique / Library | ⚙️ Purpose & Use |
| --- | --- |
| react-pdf | To render PDF documents page-by-page inside React apps. |
| pdf-lib | To manipulate PDFs (add typed text, draw image, embed signature, save PDF). |
| react-router-dom | To handle page routing/navigation between upload, dashboard, sign pages. |
| Drag & Drop (Native HTML) | To drag signatures (image/text) and drop on specific page positions. |
| Resizable & Draggable Divs | Used mouse events to implement resize, lock/unlock, and move signature boxes. |
| Tailwind CSS | For fast, responsive UI design with utility classes. |
| html-to-image (optional) | Convert typed/drawn signature to image if needed for embed. |
| Google Fonts | Load custom elegant fonts for typed signatures. |
| Canvas API | (For Draw Sign) To create hand-drawn signatures using mouse/touch on canvas. |
| Mouse Events (onMouseDown, onMouseMove, onMouseUp) | To implement resizing and dragging signature boxes. |

**🧾 In-Depth Example: How These Work Together**

**✅ PDF Preview (react-pdf)**

jsx

CopyEdit

import { Document, Page, pdfjs } from 'react-pdf';

<Document file={pdfFile}>

<Page pageNumber={currentPage} width={595.44} />

</Document>

*   **A4 size preview**
*   Dynamically changes page via navigation
*   100% scale rendering

**✅ Signature Embedding (pdf-lib)**

js

CopyEdit

const pdfDoc = await PDFDocument.load(arrayBuffer);

const pages = pdfDoc.getPages();

const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

page.drawText(signatureText, {

x, y, font, size, color: rgb(0, 0, 0)

});

*   Signatures are embedded **per page**
*   Uses same coordinates as preview after scaling
*   Works with both text and image

**✅ Drag & Drop**

js

CopyEdit

<div draggable onDragStart={handleDragStart}>

Signature Preview

</div>

<div onDrop={handleDrop} onDragOver={handleDragOver}>

<Page />

</div>

*   Captures drop coordinates
*   Adds signature data to the state (with x, y, page, width, etc.)

**✅ Lock/Delete/Resize**

js

CopyEdit

<button onClick={() => toggleLock(sig.id)}>🔒</button>

<button onClick={() => deleteSignature(sig.id)}>🗑️</button>

<div onMouseDown={handleResize}>↘</div>

*   Resize: Tracks mouse delta and adjusts width/height
*   Lock: Prevents movement
*   Delete: Removes signature from state

**✅ Google Fonts for Signature**

html

CopyEdit

<link href="https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap" rel="stylesheet">

*   Fonts loaded globally
*   Applied via inline fontFamily

**🎯 Summary Table**

| Feature | Tools / Techniques Used |
| --- | --- |
| PDF Preview | react-pdf, A4 dimensions, current page state |
| Signature Placement | Drag & drop via mouse events, state-managed signature boxes |
| Signature Rendering in PDF | pdf-lib with coordinates scaling and font embedding |
| Text & Image Support | Signature can be text, image, or canvas-based |
| Resize / Lock / Delete | Native mouse events, conditional UI rendering |
| UI Styling | Tailwind CSS, icons, button actions |
| Routing & Navigation | react-router-dom, page-based structure |

## 2\. Install Frontend Dependencies

bash

CopyEdit

cd client

npm install

### 📁 Common Frontend Dependencies:

You should see these in package.json:

json

CopyEdit

"dependencies": {

"react": "^18.x",

"react-dom": "^18.x",

"react-pdf": "^7.x",

"pdf-lib": "^1.x",

"react-router-dom": "^6.x",

"tailwindcss": "^3.x",

"postcss": "^8.x",

"autoprefixer": "^10.x"

}

## 🔐 3. Install Backend Dependencies

bash

CopyEdit

cd ../server

npm install

### 📁 Common Backend Dependencies:

You should see these in package.json:

json

CopyEdit

"dependencies": {

"express": "^4.x",

"mongoose": "^7.x",

"jsonwebtoken": "^9.x",

"bcrypt": "^5.x",

"multer": "^1.x",

"cors": "^2.x",

"dotenv": "^16.x"

}

## 🧪 4. Create Environment Files

### server/.env

env

CopyEdit

PORT=5000

MONGO\_URI=mongodb://localhost:27017/signatureApp

JWT\_SECRET=yourSecretKey

You may change the MONGO\_URI if you're using MongoDB Atlas.

## 🚀 5. Run the Project

### ➤ Run Backend:

bash

CopyEdit

cd server

npm run dev # or: node index.js / nodemon server.js

### ➤ Run Frontend:

bash

CopyEdit

cd client

npm run dev # If using Vite

## 🔗 Access in Browser

*   **Frontend**: [http://localhost:5173](http://localhost:5173)
*   **Backend**: [http://localhost:5000/api/](http://localhost:5000/api/)...

**🧠 Learning Outcomes**

*   React component architecture
*   PDF rendering & manipulation
*   Real-world drag-drop and coordinate scaling
*   UX thinking for a professional tool
