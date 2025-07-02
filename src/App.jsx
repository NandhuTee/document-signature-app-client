// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UploadForm from './components/UploadForm';
import DocumentList from './components/DocumentList';
import Home from './components/Home';
import Layout from './components/Layout'; // 👈 import Layout
import ErrorPage from './components/ErrorPage';
import Navbar from './components/Navbar';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // 👈 Wrap with Layout
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/upload', element: <UploadForm /> },
      { path: '/documents', element: <DocumentList /> },
      {  path: '/sign',  element: <SignPdf />},
      {  path: '/sign',  element: <SignPage />
}
    ]
  }
]);

function App() {
  return (
    <>
      <Navbar /> {/* This appears on every page */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
