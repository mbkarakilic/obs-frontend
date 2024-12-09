import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/useUser.context";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  if (user) return children;
};

export default ProtectedRoute;
