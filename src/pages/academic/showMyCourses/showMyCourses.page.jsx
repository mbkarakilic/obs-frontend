import React, { useEffect, useState } from "react";
import { API_URL, years } from "../../../../constants";
import toast from "react-hot-toast";
import LoadingUi from "../../../ui/loading/loading.ui";
import { useUserContext } from "../../../contexts/useUser.context";

const ShowMyCourses = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [courses, setCourses] = useState([]);

  const { user } = useUserContext();

  useEffect(() => {
    const fetchCourses = async () => {
      const formData = new FormData();

      formData.append("id", user.id);

      const res = await fetch(API_URL + "getAcademicianCourses/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Hata");
      } else {
        const data = await res.json();
        if (data.success) {
          const { courses } = data;
          setCourses(courses);
        }
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <LoadingUi />;
  }

  if (error) {
    return <h1>Hata...</h1>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-5 text-2xl font-bold">Verdiğim Dersler</h1>
      <div className="overflow-y-auto max-h-[75vh]">
        <table className="table-fixed w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">İsim</th>
              <th className="border px-4 py-2">Bölüm</th>
              <th className="border px-4 py-2">Dönem</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.course_id} className="text-center">
                <td className="border px-4 py-2">{course.course_name}</td>
                <td className="border px-4 py-2">{course.department_name}</td>
                <td className="border px-4 py-2">
                  {
                    years.find(
                      (year) => year.id === Number(course.course_semester)
                    ).name
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowMyCourses;
