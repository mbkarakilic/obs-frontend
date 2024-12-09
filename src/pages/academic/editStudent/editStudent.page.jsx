import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../../../constants";
import { Form } from "../../../components/form/form.component";
import toast from "react-hot-toast";
import { validateAll } from "../../../../helpers";
import useFetchDepartments from "../../../hooks/useFetchDepartments.hook";

const EditStudent = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;

  const [nationalId, setNationalId] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [departmentId, setDepartmentId] = useState(""); // Yeni departman ID durumu
  const { departments } = useFetchDepartments(); // Departman listesi

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Öğrenci bilgilerini getir
    const fetchStudent = async () => {
      const formData = new FormData();
      formData.append("studentId", id);
      const res = await fetch(API_URL + "getStudent/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Bir hata oluştu");
        setError(true);
      } else {
        const data = await res.json();
        if (data.success) {
          const { nationalId, name, surname, department_id } = data.student;

          setNationalId(nationalId);
          setFirstname(name);
          setLastname(surname);
          setDepartmentId(department_id); // Mevcut departman ID'sini ayarla
        } else {
          setError(true);
        }
      }
    };

    Promise.all([fetchStudent()]).then(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setButtonDisabled(true);

    const isValid = validateAll(nationalId, firstname, lastname);
    if (!isValid) {
      toast.error("Lütfen girdiğiniz bilgileri kontrol edin!");
      setButtonDisabled(false);
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("nationalId", nationalId);
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("department_id", departmentId); // Yeni departman ID'sini gönder

    const res = await fetch(API_URL + "editStudent/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Hata oluştu");
    } else {
      const data = await res.json();
      if (data.success) {
        toast.success(
          "Öğrenci düzenlendi. Kayıtlı Öğrenciler Sayfasına yönlendiriliyorsunuz..."
        );
        setTimeout(() => {
          navigate("/showStudents");
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
        placeholder="Kimlik Numarası"
        value={nationalId}
        onChange={(e) => setNationalId(e.target.value)}
      />
      <input
        type="text"
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Adı"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
      />
      <input
        type="text"
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Soyadı"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
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

export default EditStudent;
