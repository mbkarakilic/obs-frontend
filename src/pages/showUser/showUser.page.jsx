import React, { useEffect, useState } from "react";
import { API_URL } from "../../../constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/useUser.context";
import LoadingUi from "../../ui/loading/loading.ui";

const ShowUser = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState({});

  const navigate = useNavigate();
  const { user: userFromContext } = useUserContext();
  const { isStudent, id } = userFromContext;

  useEffect(() => {
    const fetchUser = async () => {
      //const localData = localStorage.getItem("userData");
      //const localStorageData = JSON.parse(localData);

      const endpoint = /*localStorageData.*/ isStudent
        ? "getStudent"
        : "getAcademician";
      const formData = new FormData();
      formData.append(
        /*localStorageData.*/ isStudent ? "studentId" : "academicianId",
        /*localStorageData.*/ id
      );
      const res = await fetch(API_URL + endpoint + "/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Bir hata oluştu");
        setError(true);
      } else {
        const data = await res.json();

        if (data.success) {
          console.log("success");
          setUser(
            data[
              `${/*localStorageData.*/ isStudent ? "student" : "academician"}`
            ]
          );
        } else {
          console.log("xxx");
          setError(true);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <LoadingUi />;
  }

  if (error) {
    return <h1>Hata...</h1>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-5 text-2xl font-bold">Kullanıcı Bilgileri</h1>
      <div className="overflow-y-auto max-h-[75vh]">
        <table className="table-fixed w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Kimlik Numarası</th>
              <th className="border px-4 py-2">İsim</th>
              <th className="border px-4 py-2">Soyisim</th>
              {isStudent && (
                <th className="border px-4 py-2">Öğrenci Numarası</th>
              )}
              {!isStudent && (
                <th className="border px-4 py-2">Bölüm</th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="border px-4 py-2">{user.nationalId}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.surname}</td>
              {isStudent && (
                <td className="border px-4 py-2">{user.username}</td>
              )}
              {!isStudent && (
                <td className="border px-4 py-2">{user.department_name}</td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowUser;
