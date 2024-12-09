import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingUi from "../../../ui/loading/loading.ui";

const ShowStudents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [students, setStudents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch(API_URL + "getStudents/", {
        method: "GET",
      });

      if (!res.ok) {
        toast.error("Bir hata oluştu");
        setError(true);
      } else {
        const data = await res.json();

        if (data.success) {
          console.log("success");
          setStudents(data.students);
          console.log(students);
        } else {
          console.log("xxx");
          setError(true);
        }
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  const handleDelete = async (studentId) => {
    const result = confirm("Emin misiniz ?");
    if (result) {
      const formData = new FormData();
      formData.append("studentId", studentId);
      const res = await fetch(API_URL + "deleteStudent/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Hata oluştu");
      } else {
        const data = await res.json();

        if (data.success) {
          toast.success("Başarıyla Silindi");

          setStudents(students.filter((student) => student.id !== studentId));
        } else {
          toast.error("Hata oluştu...");
        }
      }
    }
  };

  const handleEdit = (studentId) => {
    navigate("/editStudent/" + studentId);
  };

  if (loading) {
    return <LoadingUi />;
  }

  if (error) {
    return <h1>Hata...</h1>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-5 text-2xl font-bold">Öğrenciler</h1>
      <div className="overflow-y-auto max-h-[75vh]">
        <table className="table-fixed w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Kimlik Numarası</th>
              <th className="border px-4 py-2">Ad</th>
              <th className="border px-4 py-2">Soyad</th>
              <th className="border px-4 py-2">Öğrenci Numarası</th>
              <th className="border px-4 py-2">Bölüm</th>
              <th className="border px-4 py-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="text-center">
                <td className="border px-4 py-2">{student.nationalId}</td>
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2">{student.surname}</td>
                <td className="border px-4 py-2">{student.username}</td>
                <td className="border px-4 py-2">{student.department_name}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-500 rounded p-2 text-white"
                    onClick={() => handleDelete(student.id)}
                  >
                    &#10005;
                  </button>
                  <button
                    className="bg-green-500 rounded p-2 ml-2 text-white"
                    onClick={() => handleEdit(student.id)}
                  >
                    &#9998;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowStudents;
