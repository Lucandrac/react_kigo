import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl text-red-500 font-bold mb-4">Oups! Il y a eu un problème</h1>
        <Link to="/"> Go back home</Link>
      </div>
    </div>
  );
};

export default ErrorPage;