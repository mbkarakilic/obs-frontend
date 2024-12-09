import { useUserContext } from "../../contexts/useUser.context";
import StudentDashboard from "./studentDashboard.page";
import AcademicsDashboard from "./academicsDashboard.page";

const Dashboard = () => {
  const { user } = useUserContext();
  const { isStudent } = user;

  if (isStudent) return <StudentDashboard />;
  else return <AcademicsDashboard />;
};

export default Dashboard;
