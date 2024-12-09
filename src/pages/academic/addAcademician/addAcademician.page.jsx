import { useState } from "react";
import toast from "react-hot-toast";
import { Container } from "../../../components/container/container.component";
import { validateAll } from "../../../../helpers";
import { API_URL } from "../../../../constants";
import { Form } from "../../../components/form/form.component";

const AddAcademician = () => {
  const [nationalId, setNationalId] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

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
    formData.append("isAdmin", isAdmin ? 1 : 0);
    formData.append("department_id", 1);

    const res = await fetch(API_URL + "addAcademician/", {
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
        setIsAdmin(false);
      } else {
        toast.error("Hata oluştuaaaa!");
      }
      setButtonDisabled(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold">Akademisyen Ekle</h1>
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
        <span>
          Admin
          <input
            id="isAdmin"
            type="checkbox"
            className="border border-gray-300 p-2 ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Admin"
            value={isAdmin}
            onChange={(e) => {
              setIsAdmin(e.target.checked);
            }}
          />
        </span>
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

export default AddAcademician;
