import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingUi from "../../../ui/loading/loading.ui";
import { API_URL } from "../../../../constants";
import toast from "react-hot-toast";

const GradeExam = () => {
  const location = useLocation();
  const exam = location.state.exam;

  const navigate = useNavigate();
  if (!exam) {
    navigate("/dashboard");
  }

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetchStudentsRegisteredCourse = async () => {
      const formData = new FormData();
      formData.append("course_id", exam.course_id);

      const res = await fetch(API_URL + "getStudentsRegisteredCourse/", {
        method: "post",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Hata");
      } else {
        const data = await res.json();

        if (data.success) {
          setStudents(data.students);
        } else {
          toast.error("Hata");
        }
      }
      setLoading(false);
    };

    fetchStudentsRegisteredCourse();
  }, []);

  useEffect(() => {
    const updatedGrades = students.map((student) => ({
      student_id: student.student_id,
      grade: "",
    }));
    console.log("students updated");
    setGrades(updatedGrades);
  }, [students]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setDisabled(true);

    const formData = new FormData();
    formData.append("exam_id", exam.exam_id);
    formData.append("grades", JSON.stringify(grades)); // JSON formatında gönderiliyor.

    const res = await fetch(API_URL + "saveExamGrades/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Notlar kaydedilemedi!");
    } else {
      const data = await res.json();
      if (data.success) {
        toast.success(
          "Notlar başarıyla kaydedildi! Ana sayfaya yönlendiriliyorsunuz"
        );
        setTimeout(() => {
          navigate("/dashboard"); // İstediğiniz sayfaya yönlendirme.
        }, 1500);
      } else {
        toast.error("Bir hata oluştu.");
      }
    }
  };

  if (loading) return <LoadingUi />;

  return (
    <form className="p-8 flex flex-col items-end" onSubmit={handleSubmit}>
      <div className="overflow-y-auto max-h-[75vh]">
        <h1 className="mb-5 text-2xl font-bold text-center">Not Girişi</h1>
        <table className="table-fixed w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Numara</th>
              <th className="border px-4 py-2">Adı Soyadı</th>
              <th className="border px-4 py-2">Not</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.exam_id} className="text-center">
                <td className="border px-4 py-2">{student.student_username}</td>
                <td className="border px-4 py-2">
                  {student.student_name} {student.student_surname}
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={disabled}
                    onChange={(e) => {
                      const updatedGrades = grades.map((g) =>
                        g.student_id === student.student_id
                          ? { ...g, grade: e.target.value }
                          : g
                      );
                      setGrades(updatedGrades);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="bg-green-500 p-3 text-white mt-5 rounded rounded-md"
      >
        Kaydet
      </button>
    </form>
  );
};

export default GradeExam;
