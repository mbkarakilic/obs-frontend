import React, { useEffect, useState } from "react";
import LoadingUi from "../../../ui/loading/loading.ui";
import { useUserContext } from "../../../contexts/useUser.context";
import { API_URL } from "../../../../constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { types } from "../../../constants/examTypes";

const Grade = () => {
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

  const handleOnClick = (exam) => {
    navigate("/gradeExam", { state: { exam } });
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
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr
                    key={exam.exam_id}
                    className="text-center cursor-pointer"
                    onClick={() => handleOnClick(exam)}
                  >
                    <td className="border px-4 py-2">{exam.course_name}</td>
                    <td className="border px-4 py-2">{exam.exam_date}</td>
                    <td className="border px-4 py-2">
                      {
                        types.find((type) => type.id === Number(exam.exam_type))
                          .name
                      }
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

export default Grade;
