import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL, years } from "../../../../constants";
import { Form } from "../../../components/form/form.component";
import toast from "react-hot-toast";
import useFetchDepartments from "../../../hooks/useFetchDepartments.hook";

const EditCourse = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;

  const [courseName, setCourseName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [semester, setSemester] = useState("");
  const [ects, setEcts] = useState(""); // ECTS state
  const { departments } = useFetchDepartments();

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      const formData = new FormData();
      formData.append("courseId", id);
      const res = await fetch(API_URL + "getCourse/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("An error occurred");
        setError(true);
      } else {
        const data = await res.json();
        if (data.success) {
          const { name, department_id, semester: sem, ects: courseEcts } = data.course;
          setCourseName(name);
          setDepartmentId(department_id);
          setSemester(sem);
          setEcts(courseEcts); // ECTS değerini al
        } else {
          setError(true);
        }
      }
      setLoading(false);
    };

    fetchCourse();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setButtonDisabled(true);

    const formData = new FormData();
    formData.append("id", id);
    formData.append("courseName", courseName);
    formData.append("department_id", departmentId);
    formData.append("semester", semester);
    formData.append("ects", ects); // ECTS gönder

    const res = await fetch(API_URL + "editCourse/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Hata!");
    } else {
      const data = await res.json();
      if (data.success) {
        toast.success("Ders Düzenlendi! Dersler Sayfasına Yönlendiriliyorsunuz...");
        setTimeout(() => {
          navigate("/showCourses");
        }, 1500);
      } else {
        toast.error("Hata!");
      }
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error...</h1>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold">Edit Course</h1>
      <input
        type="text"
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />
      <select
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select Department
        </option>
        {departments.map((department) => (
          <option key={department.id} value={department.id}>
            {department.name}
          </option>
        ))}
      </select>
      <select
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select Semester
        </option>
        {years.map((year) => (
          <option key={year.id} value={year.id}>
            {year.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        max="6"
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="ECTS"
        value={ects}
        onChange={(e) => setEcts(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 active:bg-blue-700"
        disabled={buttonDisabled}
      >
        Save
      </button>
    </Form>
  );
};

export default EditCourse;
