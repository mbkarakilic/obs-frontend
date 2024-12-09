import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../../constants";
import toast from "react-hot-toast";
import { Container } from "../../components/container/container.component";
import Navbar from "../../components/navbar/navbar.component";
import { Form } from "../../components/form/form.component";
import { useUserContext } from "../../contexts/useUser.context";

const Login = () => {
  const { login } = useUserContext();
  const params = useParams();
  const navigate = useNavigate();

  console.log(params);
  if (!params.type) {
    navigate("/home");
    return;
  }

  const isStudent = params.type === "student";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [username, password] = e.target.elements;

    const formData = new FormData();
    formData.append("nationalId", username.value);
    formData.append("password", password.value);
    formData.append("isStudent", isStudent);

    const res = await fetch(API_URL + "login/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.log("Login failed");
    } else {
      const data = await res.json();
      if (data.success) {
        const user = data.user;
        let isAdmin = false;
        if (user.isAdmin) {
          isAdmin = user.isAdmin === "1";
        }
        const userData = {
          id: data.user.id,
          isStudent,
          isAdmin,
        };
        login(userData);

        navigate("/dashboard");
      } else {
        toast.error(data.error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <Form onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold">Giriş</h1>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              isStudent ? "Öğrenci/Kimlik Numarası" : "Kimlik Numarası"
            }
          />
          <input
            type="password"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Şifre"
          />
          <button
            type="submit"
            className="bg-blue-950 text-white p-2 rounded-md hover:bg-gray-600 active:bg-gray-700"
          >
            Giriş
          </button>
        </Form>
      </Container>
    </>
  );
};

export default Login;
