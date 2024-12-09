import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../contexts/useUser.context";
import LoadingUi from "../../../ui/loading/loading.ui";

const ShowAcademicians = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [academicians, setAcademicians] = useState([]);

  const navigate = useNavigate();
  const { user } = useUserContext();
  const { id } = user;

  useEffect(() => {
    const fetchAcademicians = async () => {
      try {
        const res = await fetch(API_URL + "getAcademicians/", {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Bir hata oluştu");
        }

        const data = await res.json();

        if (data.success) {
          const users = data.academicians.filter((a) => a.id !== id);

          // Kursları akademisyenlerle ilişkilendirme
          const academiciansWithCourses = users.map((user) => {
            const userCourses = data.courses
              .filter((course) => course.academic_id === user.id)
              .map((course) => course.course_name);

            return { ...user, courses: userCourses };
          });

          setAcademicians(academiciansWithCourses);
        } else {
          throw new Error("Veriler alınamadı.");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Bir hata oluştu");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicians();
  }, []);

  const handleDelete = async (academicianId) => {
    const result = confirm("Emin misiniz ?");
    if (result) {
      const formData = new FormData();
      formData.append("academicianId", academicianId);
      const res = await fetch(API_URL + "deleteAcademician/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Hata oluştu");
      } else {
        const data = await res.json();

        if (data.success) {
          toast.success("Başarıyla Silindi");

          setAcademicians(
            academicians.filter(
              (academician) => academician.id !== academicianId
            )
          );
        } else {
          toast.error("Hata oluştu...");
        }
      }
    }
  };

  const handleEdit = (academicianId) => {
    navigate("/editAcademician/" + academicianId);
  };

  if (loading) {
    return <LoadingUi />;
  }

  if (error) {
    return <h1>Hata...</h1>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-5 text-2xl font-bold">Akademisyenler</h1>
      <div className="overflow-y-auto max-h-[75vh]">
        <table className="table-fixed w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Kimlik Numarası</th>
              <th className="border px-4 py-2">İsim</th>
              <th className="border px-4 py-2">Soyisim</th>
              <th className="border px-4 py-2">Yöneticilik</th>
              <th className="border px-4 py-2">Verdiği Dersler</th>
              <th className="border px-4 py-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {academicians.map((academicians) => (
              <tr key={academicians.id} className="text-center">
                <td className="border px-4 py-2">{academicians.nationalId}</td>
                <td className="border px-4 py-2">{academicians.name}</td>
                <td className="border px-4 py-2">{academicians.surname}</td>
                <td className="border px-4 py-2">
                  {academicians.isAdmin === "1" ? (
                    <span>&#10003;</span>
                  ) : (
                    <span>&#10005;</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  {academicians.courses.length > 0
                    ? academicians.courses.join(", ")
                    : "-"}
                </td>

                <td className="border px-4 py-2">
                  <button
                    className="bg-red-500 rounded p-2 text-white"
                    onClick={() => handleDelete(academicians.id)}
                  >
                    &#10005;
                  </button>
                  <button
                    className="bg-green-500 rounded p-2 ml-2 text-white"
                    onClick={() => handleEdit(academicians.id)}
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

export default ShowAcademicians;
