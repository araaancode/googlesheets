import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [formData, setFormData] = useState({
    personnelCode: "",
    name: "",
    line: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "personnelCode") {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.personnelCode.trim()) {
      newErrors.personnelCode = "کد پرسنلی الزامی است";
    } else if (formData.personnelCode.length < 3) {
      newErrors.personnelCode = "کد پرسنلی باید حداقل ۳ رقم باشد";
    }

    if (!formData.name.trim()) {
      newErrors.name = "نام و نام خانوادگی الزامی است";
    } else if (formData.name.length < 3) {
      newErrors.name = "نام باید حداقل ۳ حرف باشد";
    }

    if (!formData.line) {
      newErrors.line = "لطفاً خط تولید را انتخاب کنید";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        { withCredentials: true }
      );
      
      toast.success("ثبت‌نام با موفقیت انجام شد!", {
        position: "top-center",
        autoClose: 3000,
        rtl: true
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "خطا در ارتباط با سرور";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        rtl: true
      });
      
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 rtl" dir="rtl">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ثبت‌نام موفق</h2>
          <p className="text-gray-600 mb-6">حساب کاربری شما با موفقیت ایجاد شد</p>
          <div className="flex justify-center">
            <ClipLoader color="#3B82F6" size={30} />
          </div>
          <p className="text-gray-500 mt-4 text-sm">در حال انتقال به صفحه ورود...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 rtl" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-5 px-6 relative">
            <button 
              onClick={() => navigate(-1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-blue-200 transition-colors"
              aria-label="بازگشت"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <h2 className="text-2xl font-bold text-white text-center">
              ثبت‌نام در سامانه
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Personnel Code */}
            <div className="space-y-2">
              <label htmlFor="personnelCode" className="block text-sm font-medium text-gray-700">
                کد پرسنلی
                <span className="text-red-500 text-right mr-1">*</span>
              </label>
              <input
                id="personnelCode"
                type="text"
                inputMode="numeric"
                name="personnelCode"
                placeholder="مثال: 12345"
                value={formData.personnelCode}
                onChange={handleChange}
                className={`w-full px-4 text-right py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg ${
                  errors.personnelCode ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                dir="ltr"
                autoFocus
              />
              {errors.personnelCode && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  {errors.personnelCode}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                 نام و نام خانوادگی
                <span className="text-red-500 mr-1">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="نام کامل خود را وارد کنید"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg ${
                  errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Production Line */}
            <div className="space-y-2">
              <label htmlFor="line" className="block text-sm font-medium text-gray-700">
                 خط تولید
                <span className="text-red-500 mr-1">*</span>
              </label>
              <select
                id="line"
                name="line"
                value={formData.line}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg ${
                  errors.line ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">انتخاب خط تولید</option>
                <option value="خط 1">خط 1</option>
                <option value="خط 2">خط 2</option>
                <option value="خط 3">خط 3</option>
                <option value="خط 4">خط 4</option>
                <option value="اداری">اداری</option>
              </select>
              {errors.line && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  {errors.line}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                  isSubmitting ? 'bg-blue-400' : 'bg-blue-900 hover:bg-blue-800'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <ClipLoader color="#ffffff" size={20} className="ml-3" />
                    <span className="mr-1">در حال ثبت‌نام...</span>
                  </>
                ) : (
                  <>
               
                    ثبت‌نام
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              قبلا ثبت‌نام کرده‌اید؟{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2"
              >
                ورود به حساب کاربری
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}