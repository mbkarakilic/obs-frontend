import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingUi from "../../../ui/loading/loading.ui";
import { useUserContext } from "../../../contexts/useUser.context";

const ShowMyStudents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [students, setStudents] = useState([]);

  const { user } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNumOfConsultants = async () => {
      const formData = new FormData();

      formData.append("id", user.id);

      const res = await fetch(API_URL + "getConsultant/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Hata");
      } else {
        const data = await res.json();
        if (data.success) {
          const { students } = data;
          setStudents(students);
        } else {
          setError(true);
        }
      }
      setLoading(false);
    };

    fetchNumOfConsultants();
  }, []);

  if (loading) {
    return <LoadingUi />;
  }

  if (error) {
    return <h1>Hata...</h1>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-5 text-2xl font-bold">Danışman Öğrencilerim</h1>
      <div className="overflow-y-auto max-h-[75vh]">
        <table className="table-fixed w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Kimlik Numarası</th>
              <th className="border px-4 py-2">Ad</th>
              <th className="border px-4 py-2">Soyad</th>
              <th className="border px-4 py-2">Öğrenci Numarası</th>
              <th className="border px-4 py-2">Bölüm</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowMyStudents;
