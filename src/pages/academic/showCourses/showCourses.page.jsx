import React, { useEffect, useState } from "react";
import { API_URL, years } from "../../../../constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingUi from "../../../ui/loading/loading.ui";

const ShowCourses = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch(API_URL + "getCourses/", {
        method: "GET",
      });

      if (!res.ok) {
        toast.error("Bir hata oluştu");
        setError(true);
      } else {
        const data = await res.json();

        if (data.success) {
          console.log("success");
          setCourses(data.courses);
          console.log(courses);
        } else {
          console.log("xxx");
          setError(true);
        }
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    const result = confirm("Emin misiniz ?");
    if (result) {
      const formData = new FormData();
      formData.append("courseId", courseId);
      const res = await fetch(API_URL + "deleteCourse/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Hata oluştu");
      } else {
        const data = await res.json();

        if (data.success) {
          toast.success("Başarıyla Silindi");

          setCourses(courses.filter((course) => course.id !== courseId));
        } else {
          toast.error("Hata oluştu...");
        }
      }
    }
  };

  const handleEdit = (courseId) => {
    navigate("/editCourse/" + courseId);
  };

  if (loading) {
    return <LoadingUi />;
  }

  if (error) {
    return <h1>Hata...</h1>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-5 text-2xl font-bold">Dersler</h1>
      <div className="overflow-y-auto max-h-[75vh]">
        <table className="table-fixed w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">İsim</th>
              <th className="border px-4 py-2">Bölüm</th>
              <th className="border px-4 py-2">Dönem</th>
              <th className="border px-4 py-2">AKTS</th>
              <th className="border px-4 py-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="text-center">
                <td className="border px-4 py-2">{course.name}</td>
                <td className="border px-4 py-2">{course.department_name}</td>
                <td className="border px-4 py-2">
                  {
                    years.find((year) => year.id === Number(course.semester))
                      .name
                  }
                </td>
                <td className="border px-4 py-2">{course.ects}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-500 rounded p-2 text-white"
                    onClick={() => handleDelete(course.id)}
                  >
                    &#10005;
                  </button>
                  <button
                    className="bg-green-500 rounded p-2 ml-2 text-white"
                    onClick={() => handleEdit(course.id)}
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

export default ShowCourses;
