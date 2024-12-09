import { useEffect, useState } from "react";
import { API_URL } from "../../../constants";
import toast from "react-hot-toast";
import LoadingUi from "../../ui/loading/loading.ui";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/useUser.context";

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const { user } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      const formData = new FormData();

      formData.append("studentId", user.id);

      const res = await fetch(API_URL + "getStudent/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Hata");
      } else {
        const data = await res.json();
        if (data.success) {
          const { student } = data;
          setStudent(student);
        }
      }
      setLoading(false);
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return <LoadingUi />;
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-2 gap-5 h-20 cursor-pointer">
        <div className="max-w bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Danışman Akademisyen
            </h3>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-2xl font-bold text-gray-800 text-center">
              {student.academician}
            </p>
          </div>
        </div>
        <div className="max-w bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Bölüm</h3>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-2xl font-bold text-gray-800 text-center">
              {student.department_name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
