import React, { useEffect, useState } from "react";
import LoadingUi from "../../../ui/loading/loading.ui";
import { useUserContext } from "../../../contexts/useUser.context";
import { API_URL } from "../../../../constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { types } from "../../../constants/examTypes";

const ShowExams = () => {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const { user } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      const formData = new FormData();
      formData.append("id", user.id);

      const res = await fetch(API_URL + "getAcademicianExams/", {
        method: "post",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Hata");
      } else {
        const data = await res.json();

        if (data.success) {
          setExams(data.exams);
        } else {
          toast.error("Hata");
        }
      }
      setLoading(false);
    };

    fetchExams();
  }, []);

  const handleEdit = (exam) => {
    navigate("/editExam", { state: { exam } });
  };

  const handleDelete = async (id) => {
    const result = confirm("Emin misiniz ?");
    if (result) {
      const formData = new FormData();
      formData.append("id", id);
      const res = await fetch(API_URL + "deleteExam/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Hata oluştu");
      } else {
        const data = await res.json();

        if (data.success) {
          toast.success("Başarıyla Silindi");

          setExams(exams.filter((exam) => exam.exam_id !== id));
        } else {
          toast.error("Hata oluştu...");
        }
      }
    }
  };

  if (loading) return <LoadingUi />;

  return (
    <div className="p-8">
      {exams.length === 0 ? (
        <p>Hiç Sınavınız yok</p>
      ) : (
        <>
          <h1 className="mb-5 text-2xl font-bold">Sınavlarım</h1>
          <div className="overflow-y-auto max-h-[75vh]">
            <table className="table-fixed w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Tarih</th>
                  <th className="border px-4 py-2">Ders</th>
                  <th className="border px-4 py-2">Tür</th>
                  <th className="border px-4 py-2">Yüzdelik</th>
                  <th className="border px-4 py-2">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.exam_id} className="text-center">
                    <td className="border px-4 py-2">{exam.course_name}</td>
                    <td className="border px-4 py-2">{exam.exam_date}</td>
                    <td className="border px-4 py-2">
                      {
                        types.find((type) => type.id === Number(exam.exam_type))
                          .name
                      }
                    </td>
                    <td className="border px-4 py-2">{exam.exam_percent}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-red-500 rounded p-2 text-white"
                        onClick={() => handleDelete(exam.exam_id)}
                      >
                        &#10005;
                      </button>
                      <button
                        className="bg-green-500 rounded p-2 ml-2 text-white"
                        onClick={() => handleEdit(exam)}
                      >
                        &#9998;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ShowExams;
