import { useState } from "react";
import { Container } from "../../../components/container/container.component";
import { API_URL, years } from "../../../../constants";
import { Form } from "../../../components/form/form.component";
import toast from "react-hot-toast";
import useFetchDepartments from "../../../hooks/useFetchDepartments.hook";

const AddCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Seçilen departmanın ID'si
  const [semester, setSemester] = useState(""); // Yeni departman ID durumu
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { departments } = useFetchDepartments();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setButtonDisabled(true);

    const formData = new FormData();
    formData.append("courseName", courseName);
    formData.append("department_id", selectedDepartment); // Seçilen departman ID'sini kullan
    formData.append("semester", semester); // Yeni departman ID'sini gönder

    const res = await fetch(API_URL + "addCourse/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Hata oluştu!");
    } else {
      const data = await res.json();
      console.log(data);
      if (data.success) {
        toast.success("Kayıt Başarılı!");
        setCourseName("");
        setSelectedDepartment(""); // Seçimi sıfırla
      } else {
        toast.error("Hata oluştu!");
      }
      setButtonDisabled(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold">Ders Ekle</h1>
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ders adı"
          value={courseName}
          required
          onChange={(e) => {
            setCourseName(e.target.value);
          }}
        />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          required
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
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-900"
          disabled={buttonDisabled}
        >
          Ekle
        </button>
      </Form>
    </Container>
  );
};

export default AddCourse;
