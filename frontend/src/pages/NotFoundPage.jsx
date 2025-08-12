// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col justify-center items-center p-4 rtl" dir="rtl">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {/* 404 Graphic */}
        <div className="relative mb-6">
          <div className="text-9xl font-bold text-blue-400 opacity-20">۴۰۴</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">صفحه مورد نظر یافت نشد</h1>
        
        {/* Description */}
        <p className="text-gray-600 mb-6">
          متأسفیم، صفحه ای که به دنبال آن هستید وجود ندارد یا ممکن است حذف شده باشد.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <FaArrowLeft />
            بازگشت
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaHome />
            صفحه اصلی
          </button>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-8 text-gray-500 text-sm">
        اگر مشکل ادامه داشت، با پشتیبانی تماس بگیرید
      </p>
    </div>
  );
};

export default NotFound;