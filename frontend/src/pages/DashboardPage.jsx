import React, { useEffect, useState } from "react";
import axios from "axios";
import ShiftTable from "../components/ShiftTable";
import { MoonLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://googlesheets-onxc.onrender.com/api/auth/me",
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "خطا در دریافت اطلاعات کاربر"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post(
        "https://googlesheets-onxc.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/login");
    } catch (err) {
      setError("خطا در خروج از سیستم");
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 rtl">
        <MoonLoader color="#3B82F6" size={60} />
        <p className="mt-4 text-gray-600 text-lg">در حال بارگذاری اطلاعات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4 rtl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-red-800 mb-2">خطا</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 rtl" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-right flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              داشبورد - خوش آمدید {user.name}
            </h1>
            <p className="text-gray-500 mt-2">اطلاعات کاربری و شیفت کاری شما</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            {isLoggingOut ? (
              <>
                <MoonLoader color="#fff" size={20} className="ml-2" />
                در حال خروج...
              </>
            ) : (
              <>
                خروج
              </>
            )}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              اطلاعات کاربری
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-right w-1/2">کد پرسنلی:</span>
                <span className="font-medium text-gray-800 text-left w-1/2">{user.personnelCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-right w-1/2">خط تولید:</span>
                <span className="font-medium text-gray-800 text-left w-1/2">{user.line}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 overflow-x-auto">
          <ShiftTable />
        </div>
      </div>
    </div>
  );
}
