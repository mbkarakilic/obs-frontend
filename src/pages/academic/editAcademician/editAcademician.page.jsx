import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../../../constants";
import { Form } from "../../../components/form/form.component";
import toast from "react-hot-toast";
import { validateAll } from "../../../../helpers";
import Loading from "../../../ui/loading/loading.ui";

const EditAcademician = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;

  const [nationalId, setNationalId] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [academician, setAcademician] = useState({});
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    const fetchAcademician = async () => {
      const formData = new FormData();
      formData.append("academicianId", id);
      const res = await fetch(API_URL + "getAcademician/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Bir hata oluştu");
        setError(true);
      } else {
        const data = await res.json();

        if (data.success) {
          setAcademician(data.academician);
          const {
            nationalId,
            name,
            surname,
            isAdmin: isAdminFromFetch,
          } = data.academician;

          setNationalId(nationalId);
          setFirstname(name);
          setLastname(surname);
          setIsAdmin(isAdminFromFetch === "1");

          // Akademisyene ait kursları kaydet
          setCourses(data.courses);
        } else {
          setError(true);
        }
      }
      setLoading(false);
    };

    fetchAcademician();
  }, [id]);

  useEffect(() => {
    // courses güncellendiğinde çalışır
    const fetchCourses = async () => {
      console.log("TRIGGERED");

      const res = await fetch(API_URL + "getCourses/");
      if (!res.ok) {
        toast.error("Hata");
      } else {
        const data = await res.json();

        if (data.success) {
          // Akademisyene ait olmayan kursları filtrele
          const diffCourses = data.courses.filter(
            (course) => !courses.some((c) => c.course_name === course.name)
          );
          console.log(diffCourses);
          setAllCourses(diffCourses);
        } else {
          toast.error("dersler gelmiyo");
        }
      }
    };

    fetchCourses();
  }, [courses]); // courses bağımlılığı ile fetchCourses çalışır

  const handleSubmit = async (e) => {
    e.preventDefault();

    setButtonDisabled(true);

    const isValid = validateAll(nationalId, firstname, lastname);
    if (!isValid) {
      toast.error("Lütfen Girdiğiniz Bilgileri Kontrol Edin!");
      setButtonDisabled(false);
      return;
    }

    // FormData oluştur ve bilgileri ekle
    const formData = new FormData();
    formData.append("id", id);
    formData.append("nationalId", nationalId);
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("isAdmin", isAdmin ? "1" : "0");

    // Kursları JSON formatına çevirerek gönder
    formData.append("courses", JSON.stringify(courses));

    console.log(JSON.stringify(courses));
    const res = await fetch(API_URL + "editAcademician/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Hata oluştu");
    } else {
      const data = await res.json();
      if (data.success) {
        toast.success(
          "Akademisyen düzenlendi. Kayıtlı Akademisyenler Sayfasına yönlendiriliyorusnuz..."
        );
        setTimeout(() => {
          navigate("/showAcademicians");
        }, 1500);
      } else {
        toast.error("Hata oluştu");
      }
    }
  };

  const onChangeHandler = (e) => {
    const { value } = e.target;
    if (value !== "null") {
      setCourses((previus) => {
        return [
          ...previus,
          {
            course_id: value,
            course_name: allCourses.find((c) => c.id === value).name,
          },
        ];
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <h1>Hata...</h1>;
  }

  const handleDeleteCourse = (course_id) => {
    setCourses((prev) => {
      return prev.filter((c) => c.course_id !== course_id);
    });
  };

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
      <span>
        Admin
        <input
          id="isAdmin"
          type="checkbox"
          className="border border-gray-300 p-2 ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Admin"
          defaultChecked={isAdmin}
          onChange={(e) => {
            setIsAdmin(e.target.checked);
          }}
        />
      </span>
      {courses ? (
        <>
          <h2 className="font-bold text-xl">Verilen Dersler</h2>
          <ul>
            {courses.length > 0 ? (
              courses.map((course) => (
                <li key={course.course_id} className="flex gap-2">
                  <span>{course.course_name}</span>
                  <button
                    className="bg-red-500 text-white rounded-xl py-1 px-2"
                    onClick={() => handleDeleteCourse(course.course_id)}
                  >
                    X
                  </button>
                </li>
              ))
            ) : (
              <p>Akademisyene ait bir ders bulunamadı</p>
            )}
          </ul>
          {allCourses.length > 0 ? (
            <select name="courses" id="courses" onChange={onChangeHandler}>
              <option value="null">Select Course To Add</option>
              {allCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          ) : (
            <p>Kurs yok</p>
          )}
        </>
      ) : (
        <p>Kurs yok</p>
      )}
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

export default EditAcademician;
