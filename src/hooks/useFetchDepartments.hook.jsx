import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_URL } from "../../constants";

const useFetchDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(API_URL + "getDepartments/", {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Bir hata oluştu");
        }

        const data = await res.json();

        if (data.success) {
          setDepartments(data.departments);
        } else {
          throw new Error("Başarısız istek");
        }
      } catch (error) {
        toast.error(error.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, loading, error };
};

export default useFetchDepartments;
