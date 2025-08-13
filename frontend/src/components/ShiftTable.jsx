import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ShiftTable() {
  const [grid, setGrid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const res = await axios.get("https://googlesheets-onxc.onrender.com/api/shifts", { 
        withCredentials: true 
      });
      setGrid(res.data.grid || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "خطا در دریافت اطلاعات شیفت‌ها");
      setLoading(false);
      toast.error("خطا در دریافت اطلاعات شیفت‌ها");
    }
  };

  const handleEdit = (day, shift) => {
    const shiftData = grid.find(d => d.day === day)?.shifts?.find(s => s.shift === shift);
    setEditData({ 
      day, 
      shift, 
      status: shiftData?.status,
      user: shiftData?.user || ""
    });
    setIsEditing(true);
  };

  const handleDelete = async (day, shift) => {
    if (window.confirm("آیا از حذف این شیفت مطمئن هستید؟")) {
      try {
        await axios.delete(`https://googlesheets-onxc.onrender.com/api/shifts/${day}/${shift}`, {
          withCredentials: true
        });
        toast.success("شیفت با موفقیت حذف شد");
        fetchShifts();
      } catch (err) {
        toast.error(err.response?.data?.message || "خطا در حذف شیفت");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put("https://googlesheets-onxc.onrender.com/api/shifts", editData, {
        withCredentials: true
      });
      toast.success("شیفت با موفقیت به‌روزرسانی شد");
      fetchShifts();
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در به‌روزرسانی شیفت");
    }
  };

  const filteredGrid = grid.filter(item => 
    item.day.toString().includes(searchTerm) ||
    (item.shifts.some(shift => 
      shift.user && shift.user.toString().includes(searchTerm)
    )
  );

  const renderStatus = (status) => {
    switch (status) {
      case "available":
        return <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          موجود
        </span>;
      case "not available":
        return <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          غیرموجود
        </span>;
      default:
        return <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-500"></span>
          تعیین نشده
        </span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" dir="rtl">
        <ClipLoader color="#3B82F6" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6" dir="rtl">
        <div className="flex items-start">
          <div className="flex-shrink-0 ml-3">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden" dir="rtl">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-800 text-right">برنامه شیفت‌ها</h3>
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            dir="rtl"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
            placeholder="جستجوی روز یا کاربر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">ویرایش شیفت روز {editData.day}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت شیفت ({editData.shift})</label>
                <select
                  dir="rtl"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={editData.status}
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="available">موجود</option>
                  <option value="not available">غیرموجود</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">کاربر</label>
                <input
                  type="text"
                  dir="rtl"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={editData.user || ''}
                  onChange={(e) => setEditData({...editData, user: e.target.value})}
                  placeholder="نام کاربر را وارد کنید"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsEditing(false)}
                >
                  انصراف
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  onClick={handleUpdate}
                >
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                روز ماه
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                شیفت صبح
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                کاربر صبح
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                شیفت عصر
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                کاربر عصر
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                شیفت شب
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                کاربر شب
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                اقدامات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGrid.length > 0 ? (
              filteredGrid.map(({ day, shifts }) => {
                const morningShift = shifts.find(s => s.shift === "morning");
                const eveningShift = shifts.find(s => s.shift === "evening");
                const nightShift = shifts.find(s => s.shift === "night");

                return (
                  <tr key={day} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                        {day}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderStatus(morningShift?.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {morningShift?.user || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderStatus(eveningShift?.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {eveningShift?.user || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderStatus(nightShift?.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {nightShift?.user || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => console.log(`Viewing ${day} - morning shift`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-50"
                          title="مشاهده شیفت صبح"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          onClick={() => handleEdit(day, "morning")}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors p-2 rounded-full hover:bg-yellow-50"
                          title="ویرایش شیفت صبح"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(day, "morning")}
                          className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
                          title="حذف شیفت صبح"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <FaSearch className="mb-2" size={24} />
                    <p className="text-sm">هیچ داده‌ای یافت نشد</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
