import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Container } from "../../../components/container/container.component";
import { API_URL } from "../../../../constants";
import { Form } from "../../../components/form/form.component";
import { validateAll } from "../../../../helpers";
import useFetchDepartments from "../../../hooks/useFetchDepartments.hook";
import Loading from "../../../ui/loading/loading.ui";

const AddStudent = () => {
  const [nationalId, setNationalId] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Seçilen departmanın ID'si
  const [consultant, setConsultant] = useState(""); // Seçilen departmanın ID'si
  const [consultantDisabled, setConsultantDisabled] = useState(false);

  const [consultants, setConsultants] = useState([]);

  const consultantRef = useRef();

  const { departments, loading } = useFetchDepartments();

  if (loading) {
    return <Loading />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    //regex

    const isValid = validateAll(nationalId, firstname, lastname);
    console.log(isValid);
    if (!isValid) {
      toast.error("Lütfen Girdiğiniz Bilgileri Kontrol Edin!");
      return;
    }

    setButtonDisabled(true);

    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("nationalId", nationalId);
    formData.append("department_id", selectedDepartment);
    formData.append("consultant_id", consultant);

    const res = await fetch(API_URL + "addStudent/", {
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
        setNationalId("");
        setFirstname("");
        setLastname("");
      } else {
        toast.error("Hata oluştuaaaa!");
      }
      setButtonDisabled(false);
    }
  };

  const updateConsultants = async (departmentId) => {
    setConsultant("");
    setConsultantDisabled(true);

    const formData = new FormData();
    formData.append("id", departmentId);

    const res = await fetch(API_URL + "getAcademiciansOfDepartment/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("hata");
    } else {
      const data = await res.json();
      if (data.success) {
        setConsultants(data.academicians);
        setConsultantDisabled(false);
      }
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold">Öğrenci Ekle</h1>
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Kimlik Numarası"
          value={nationalId}
          required
          onChange={(e) => {
            setNationalId(e.target.value);
          }}
        />
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ad"
          value={firstname}
          required
          onChange={(e) => {
            setFirstname(e.target.value);
          }}
        />
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Soyad"
          value={lastname}
          required
          onChange={(e) => {
            setLastname(e.target.value);
          }}
        />
        <select
          value={selectedDepartment}
          onChange={(e) => {
            setSelectedDepartment(e.target.value);
            updateConsultants(e.target.value);
          }}
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
        {consultants.length > 0 && (
          <select
            value={consultant}
            onChange={(e) => setConsultant(e.target.value)}
            required
            disabled={consultantDisabled}
            ref={consultantRef}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Danışman Seçiniz
            </option>
            {consultants.map((consultant) => (
              <option key={consultant.id} value={consultant.id}>
                {consultant.name}
              </option>
            ))}
          </select>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-900"
          disabled={buttonDisabled}
        >
          Login
        </button>
      </Form>
    </Container>
  );
};

export default AddStudent;
