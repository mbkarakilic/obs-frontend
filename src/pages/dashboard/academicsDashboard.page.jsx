import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../constants";
import LoadingUi from "../../ui/loading/loading.ui";
import { useUserContext } from "../../contexts/useUser.context";

const AcademicsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [numOfStudents, setNumOfStudents] = useState(0);
  const [numOfCourses, setNumOfCourses] = useState(0);
  const { user } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNumOfConsultants = async () => {
      const formData = new FormData();

      formData.append("id", user.id);

      const res = await fetch(API_URL + "getConsultant/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Hata");
      } else {
        const data = await res.json();
        if (data.success) {
          const { students } = data;
          setNumOfStudents(students.length);
        }
      }
    };

    const fetchNumOfCourses = async () => {
      const formData = new FormData();

      formData.append("id", user.id);

      const res = await fetch(API_URL + "getAcademicianCourses/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Hata");
      } else {
        const data = await res.json();
        if (data.success) {
          const { courses } = data;
          setNumOfCourses(courses.length);
        }
      }
      setLoading(false);
    };

    fetchNumOfConsultants().then(() => {
      fetchNumOfCourses();
    });
  }, []);

  if (loading) {
    return <LoadingUi />;
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-2 gap-5 h-20 cursor-pointer">
        <div
          className="max-w bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          onClick={() => {
            navigate("/showMyStudents");
          }}
        >
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Toplam Danışman Öğrenci Sayısı
            </h3>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-2xl font-bold text-gray-800 text-center">
              {numOfStudents}
            </p>
          </div>
        </div>
        <div
          className="max-w bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          onClick={() => {
            navigate("/showMyCourses");
          }}
        >
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Verilen Ders Sayısı
            </h3>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-2xl font-bold text-gray-800 text-center">
              {numOfCourses}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicsDashboard;
