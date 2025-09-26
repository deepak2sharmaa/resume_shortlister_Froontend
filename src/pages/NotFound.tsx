




import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const NotFound: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-8 rounded shadow text-center">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="mb-4">Page not found</p>
          <Link to="/" className="px-4 py-2 bg-sky-600 text-white rounded">Go Home</Link>
        </div>
      </main>
    </>
  );
};

export default NotFound;
