import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import UploadForm from './components/UploadForm';
import DocumentList from './components/DocumentList';
import SignPdf from './components/SignPdf';
import SignPage from './pages/SignPage';
import SignAndDownload from './components/SignAndDownload';
import SignDocument from './components/SignDocument';
import SignTypedPDF from './components/SignTypedPDF';
import SignImagePage from './pages/SignImagePage';
import SignDrawPage from './pages/SignDrawPage';
import SignPDFPage from './utils/SignPDFPage';
import Dashboard from './components/Dashboard';
import ErrorPage from './components/ErrorPage';
import { checkAuth } from './utils/auth';
import TypedSignatureDrag from './components/TypedSignatureDrag'; // 

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/upload', element: <UploadForm /> },
      { path: '/documents', element: <DocumentList /> },
      { path: '/sign/pdf', element: <SignPdf /> },
      { path: '/sign/page', element: <SignPage /> },
      { path: '/sign/download', element: <SignAndDownload /> },
      { path: '/sign/:id', element: <SignDocument />, errorElement: <ErrorPage /> },
      { path: '/sign-pdf', element: <SignPDFPage /> },
      { path: '/sign-image', element: <SignImagePage /> },
      { path: '/sign-Draw', element: <SignDrawPage /> },
      { path: '/sign-typed', element: <SignTypedPDF /> },
      { path: '/typed-signature', element: <TypedSignatureDrag /> },
      { path: '/dashboard', element: <Dashboard />, loader: checkAuth },

      
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App; 
