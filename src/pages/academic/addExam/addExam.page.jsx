import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Container } from "../../../components/container/container.component";
import { API_URL, types } from "../../../../constants";
import { Form } from "../../../components/form/form.component";
import LoadingUi from "../../../ui/loading/loading.ui";
import { useUserContext } from "../../../contexts/useUser.context";

const AddExam = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // Tarih state'i
  const [percent, setPercent] = useState(0); // Tarih state'i
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [type, setType] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      const formData = new FormData();
      formData.append("id", user.id);

      const res = await fetch(API_URL + "getAcademicianCourses/", {
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

    fetchMyCourses();
  }, []);

  if (loading) return <LoadingUi />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);

    const formData = new FormData();
    formData.append("course_id", selectedCourse);
    formData.append("academic_id", user.id);
    formData.append("date", selectedDate);
    formData.append("type", type);
    formData.append("percent", percent);

    const res = await fetch(API_URL + "addExam/", {
      method: "post",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Hata!");
    } else {
      const data = await res.json();

      if (data.success) {
        toast.success(
          "Sınav Başarıyla Oluşturuldu. Sınavlar Ekranına Yönlendiriliyorsunuz..."
        );
        setTimeout(() => {
          navigate("/showExams");
        }, 1500);
      } else {
        toast.error("Hata!");
      }
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold mb-4">Sınav Ekle</h1>
        {/* Ders Seçimi */}
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          required
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="" disabled>
            Ders Seçiniz
          </option>
          {courses.map((course) => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_name}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="" disabled>
            Tür Seçiniz
          </option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <div className="space-y-4">
          <label htmlFor="percent" className="block text-lg font-semibold">
            Yüzdelik
          </label>
          <input
            id="percent"
            type="number"
            value={percent}
            min={1}
            max={100}
            onChange={(e) => {
              setPercent(e.target.value);
            }}
            required
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
        {/* Tarih Girişi */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            console.log(e.target.value);
            setSelectedDate(e.target.value);
          }}
          required
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
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

export default AddExam;
