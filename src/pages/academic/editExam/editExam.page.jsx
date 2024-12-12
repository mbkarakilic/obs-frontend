import React, { useEffect, useState } from "react";
import LoadingUi from "../../../ui/loading/loading.ui";
import { API_URL } from "../../../../constants";
import toast from "react-hot-toast";
import { Container } from "../../../components/container/container.component";
import { Form } from "../../../components/form/form.component";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../../../contexts/useUser.context";
import { types } from "../../../constants/examTypes";

const EditExam = () => {
  const location = useLocation();
  const exam = location.state.exam;
  const navigate = useNavigate();

  if (!exam) {
    navigate("/dashboard");
    return;
  }
  const { user } = useUserContext();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(exam.course_name);
  const [selectedDate, setSelectedDate] = useState(exam.exam_date); // Tarih state'i
  const [type, setType] = useState(exam.exam_type);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [percent, setPercent] = useState(exam.exam_percent); // Tarih state'i

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
          console.log(
            courses.indexOf(
              courses.find((course) => course.course_name === exam.course_name)
            )
          );
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
    formData.append("id", exam.exam_id);
    const courseId = courses.find(
      (course) => course.course_name === selectedCourse
    ).course_id;
    console.log(courseId);
    formData.append("course_id", courseId);
    formData.append("date", selectedDate);
    formData.append("type", type);
    formData.append("percent", percent);

    const res = await fetch(API_URL + "editExam/", {
      method: "post",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Hata!");
    } else {
      const data = await res.json();

      if (data.success) {
        toast.success(
          "Sınav Başarıyla Düzenlendi. Sınavlar Ekranına Yönlendiriliyorsunuz..."
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
        <h1 className="text-3xl font-bold mb-4">Sınavı Düzenle</h1>
        {/* Ders Seçimi */}
        <select
          value={courses.indexOf(
            courses.find((course) => course.course_name === exam.course_name)
          )}
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
          Kaydet
        </button>
      </Form>
    </Container>
  );
};

export default EditExam;
