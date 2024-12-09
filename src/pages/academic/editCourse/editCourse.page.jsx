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
  const [departmentId, setDepartmentId] = useState(""); // Yeni departman ID durumu
  const [semester, setSemester] = useState(""); // Yeni departman ID durumu
  const { departments } = useFetchDepartments(); // Departman listesini getir

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
        toast.error("Bir hata oluştu");
        setError(true);
      } else {
        const data = await res.json();
        if (data.success) {
          const { name, department_id, semester: sem } = data.course;
          setCourseName(name);
          setDepartmentId(department_id); // Mevcut departman ID'sini ayarla
          setSemester(sem);
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
    formData.append("department_id", departmentId); // Yeni departman ID'sini gönder
    formData.append("semester", semester); // Yeni departman ID'sini gönder

    const res = await fetch(API_URL + "editCourse/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Hata oluştu");
    } else {
      const data = await res.json();
      if (data.success) {
        toast.success(
          "Ders düzenlendi. Kayıtlı Dersler Sayfasına yönlendiriliyorsunuz..."
        );
        setTimeout(() => {
          navigate("/showCourses");
        }, 1500);
      } else {
        toast.error("Hata oluştu");
      }
    }
  };

  if (loading) {
    return <h1>Yükleniyor...</h1>;
  }

  if (error) {
    return <h1>Hata...</h1>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold">Düzenle</h1>
      <input
        type="text"
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ders Adı"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />
      <select
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Departman Seçiniz
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
          Dönem Seçiniz
        </option>
        {years.map((year) => (
          <option key={year.id} value={year.id}>
            {year.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 active:bg-blue-700"
        disabled={buttonDisabled}
      >
        Kaydet
      </button>
    </Form>
  );
};

export default EditCourse;
