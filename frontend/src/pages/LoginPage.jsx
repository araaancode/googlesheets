import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners";

export default function Login() {
  const [personnelCode, setPersonnelCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input before submission
    if (!personnelCode.trim()) {
      setError("لطفاً کد پرسنلی خود را وارد نمایید");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await axios.post(
        "https://googlesheets-onxc.onrender.com/api/auth/login",
        { personnelCode },
        { withCredentials: true }
      );
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "مشکل در اتصال به سرور، لطفاً مجدداً تلاش نمایید";
      setError(errorMessage);
      // Auto-focus input on error for better UX
      document.getElementById("personnelCode")?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 rtl" dir="rtl">
      <div className="w-full max-w-md px-4 py-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
          {/* Header with improved contrast */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-5 px-6">
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <h2 className="text-2xl font-bold text-white text-center">
                 مدیریت شیفت‌های کاری
              </h2>
            </div>
          </div>

          {/* Form with better spacing and validation */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-start"
                role="alert"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="personnelCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                کد پرسنلی
                <span className="text-red-500 mr-1">*</span>
              </label>
              <input
                id="personnelCode"
                type="text"
                inputMode="numeric"
                name="personnelCode"
                placeholder="مثال: 12345"
                value={personnelCode}
                onChange={(e) => {
                  // Basic input sanitization
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setPersonnelCode(value);
                }}
                className="w-full text-right px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg placeholder-gray-400"
                required
                autoFocus
                autoComplete="off"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "error-message" : undefined}
                dir="ltr" // Numbers display LTR even in RTL context
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${isLoading ? 'bg-blue-400' : 'bg-blue-900 hover:bg-blue-800'}`}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <MoonLoader color="#ffffff" size={20} className="ml-3" />
                  <span className="mr-1">در حال ورود...</span>
                </>
              ) : (
                <>
                  ورود به سیستم
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
             حساب ندارید؟
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2"
              >
               ثبت نام
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
