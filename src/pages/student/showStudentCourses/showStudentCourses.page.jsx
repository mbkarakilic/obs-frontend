import React, { useEffect, useState } from "react";
import LoadingUi from "../../../ui/loading/loading.ui";
import { useUserContext } from "../../../contexts/useUser.context";
import { API_URL } from "../../../../constants";
import toast from "react-hot-toast";

const ShowStudentCourses = () => {
  const [loading, setLoading] = useState();
  const [courses, setCourses] = useState([]);

  const { user } = useUserContext();

  useEffect(() => {
    const fetchCourses = async () => {
      const formData = new FormData();
      formData.append("id", user.id);

      const res = await fetch(API_URL + "getStudentCourses/", {
        method: "post",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Hata");
      } else {
        const data = await res.json();

        if (data.success) {
          setCourses(data.courses);
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
      <h1 className="mb-5 text-2xl font-bold">Dersler</h1>
      <div className="overflow-y-auto max-h-[75vh]">
        <table className="table-fixed w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">İsim</th>
              <th className="border px-4 py-2">Bölüm</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="text-center">
                <td className="border px-4 py-2">{course.course_name}</td>
                <td className="border px-4 py-2">{course.department_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ShowStudentCourses;
