import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/useUser.context";

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({
    akademisyen: false,
    dersDonem: false,
    staj: false,
    admin: false,
    ders: false,
  });

  const { user } = useUserContext();
  const { isAdmin, isStudent } = user;
  const navigate = useNavigate();

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const goDashboard = (section) => {
    navigate("/dashboard");
  };

  return (
    <div className="w-full bg-blue-950 text-white min-h-screen flex flex-col border-r border-gray-300">
      <div
        className="p-4 text-center font-bold text-lg border-b border-blue-700 cursor-pointer"
        onClick={goDashboard}
      >
        X Üniversitesi
        <p className="text-sm font-light">Öğrenci Bilgi Sistemi</p>
      </div>
      <div className="flex-1">
        {/* Akademisyen İşlemleri */}
        <div>
          <button
            className="w-full text-left px-4 py-2 hover:bg-blue-800"
            onClick={() => toggleSection("akademisyen")}
          >
            {isStudent ? "Öğrenci İşlemleri" : "Akademisyen İşlemleri"}
          </button>
          {openSections.akademisyen && (
            <div className="ml-4">
              <Link
                to="/showUser"
                className="block px-4 py-2 hover:bg-blue-700 rounded"
              >
                Genel Bilgiler
              </Link>
              {!isStudent && (
                <>
                  <Link
                    to="/showMyCourses"
                    className="block px-4 py-2 hover:bg-blue-700 rounded"
                  >
                    Derslerim
                  </Link>
                  <Link
                    to="/showMyStudents"
                    className="block px-4 py-2 hover:bg-blue-700 rounded"
                  >
                    Danışman Öğrencilerim
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Admin İşlemleri */}
        {!isStudent && isAdmin && (
          <div>
            <button
              className="w-full text-left px-4 py-2 hover:bg-blue-800"
              onClick={() => toggleSection("admin")}
            >
              Admin İşlemleri
            </button>
            {openSections.admin && (
              <div className="ml-4">
                <Link
                  to="/addStudent"
                  className="block px-4 py-2 hover:bg-blue-700 rounded"
                >
                  Öğrenci Ekle
                </Link>
                <Link
                  to="/showStudents"
                  className="block px-4 py-2 hover:bg-blue-700 rounded"
                >
                  Kayıtlı Öğrenciler
                </Link>
                <Link
                  to="/addAcademician"
                  className="block px-4 py-2 hover:bg-blue-700 rounded"
                >
                  Akademisyen Ekle
                </Link>
                <Link
                  to="/showAcademicians"
                  className="block px-4 py-2 hover:bg-blue-700 rounded"
                >
                  Kayıtlı Akademisyenler
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Ders */}
        <div>
          <button
            className="w-full text-left px-4 py-2 hover:bg-blue-800"
            onClick={() => toggleSection("ders")}
          >
            Ders
          </button>
          {openSections.ders && (
            <div className="ml-4">
              {isAdmin && (
                <>
                  <Link
                    to="/addCourse"
                    className="block px-4 py-2 hover:bg-blue-700 rounded"
                  >
                    Ders Ekle
                  </Link>
                  <Link
                    to="/showCourses"
                    className="block px-4 py-2 hover:bg-blue-700 rounded"
                  >
                    Dersleri Görüntüle
                  </Link>
                </>
              )}
              {isStudent ? (
                <>
                  <Link
                    to="/showStudentCourses"
                    className="block px-4 py-2 hover:bg-blue-700 rounded"
                  >
                    Derslerim
                  </Link>
                  <Link
                    to="/showStudentGrades"
                    className="block px-4 py-2 hover:bg-blue-700 rounded"
                  >
                    Notlarım
                  </Link>
                  <Link
                    to="/showStudentExams"
                    className="block px-4 py-2 hover:bg-blue-700 rounded"
                  >
                    Sınav Takvimi
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/addExam"
                    className="block px-4 py-2 hover:bg-blue-700 rounded"
                  >
                    Sınav Ekle
                  </Link>
                  <Link
                    to="/showExams"
                    className="block px-4 py-2 hover:bg-blue-700 rounded"
                  >
                    Sınavları Görüntüle
                  </Link>
                  <Link
                    to="/grade"
                    className="block px-4 py-2 hover:bg-blue-700 rounded"
                  >
                    Not Girişi
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
