import React, { useEffect, useState } from "react";
import LoadingUi from "../../../ui/loading/loading.ui";
import { useUserContext } from "../../../contexts/useUser.context";
import { API_URL, types } from "../../../../constants";
import toast from "react-hot-toast";

const ShowStudentGrades = () => {
  const [loading, setLoading] = useState();
  const [grades, setGrades] = useState([]);

  const { user } = useUserContext();

  useEffect(() => {
    const fetchCourses = async () => {
      const formData = new FormData();
      formData.append("id", user.id);

      const res = await fetch(API_URL + "getStudentGrades/", {
        method: "post",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Hata");
      } else {
        const data = await res.json();

        if (data.success) {
          setGrades(data.grades);
        } else {
          toast.error("Hata");
        }
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  if (loading) return <LoadingUi />;

  return (
    <div className="p-8">
      <h1 className="mb-5 text-2xl font-bold">Notlarım</h1>
      <div className="overflow-y-auto max-h-[75vh]">
        <table className="table-fixed w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Ders</th>
              <th className="border px-4 py-2">Notlandırma Türü</th>
              <th className="border px-4 py-2">Not</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id} className="text-center">
                <td className="border px-4 py-2">{grade.course_name}</td>
                <td className="border px-4 py-2">
                  {
                    types.find((type) => type.id === Number(grade.exam_type))
                      .name
                  }
                </td>
                <td className="border px-4 py-2">{grade.student_grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ShowStudentGrades;
