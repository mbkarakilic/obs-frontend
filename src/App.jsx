import { Route, Routes, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/useUser.context";
import { Toaster } from "react-hot-toast";

import AppLayout from "./layouts/app/app.layout";
import Dashboard from "./pages/dashboard/dashboard.page";
import Login from "./pages/login/login.page";
import Home from "./pages/home/home.page";
import ShowUser from "./pages/showUser/showUser.page";
import ProtectedRoute from "./routes/protected/protected.route";
import AddStudent from "./pages/academic/addStudent/addStudent.page";
import ShowStudents from "./pages/academic/showStudents/showStudents.page";
import EditStudent from "./pages/academic/editStudent/editStudent.page";
import AddAcademician from "./pages/academic/addAcademician/addAcademician.page";
import ShowAcademicians from "./pages/academic/showAcademicians/showAcademicians.page";
import EditAcademician from "./pages/academic/editAcademician/editAcademician.page";
import AddCourse from "./pages/academic/addCourse/addCourse.page";
import ShowCourses from "./pages/academic/showCourses/showCourses.page";
import EditCourse from "./pages/academic/editCourse/editCourse.page";
import ShowMyStudents from "./pages/academic/showMyStudents/showMyStudents.page";
import ShowMyCourses from "./pages/academic/showMyCourses/showMyCourses.page";
import AddExam from "./pages/academic/addExam/addExam.page";
import ShowExams from "./pages/academic/showExams/showExams.page";
import EditExam from "./pages/academic/editExam/editExam.page";
import Grade from "./pages/academic/grade/grade.page";
import GradeExam from "./pages/academic/gradeExam/gradeExam.page";
import ShowStudentCourses from "./pages/student/showStudentCourses/showStudentCourses.page";
import ShowStudentGrades from "./pages/student/showStudentGrades/showStudentGrades.page";
import ShowStudentExams from "./pages/student/showStudentExams/showStudentExams.page";

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="showUser" element={<ShowUser />} />

          <Route path="addStudent" element={<AddStudent />} />
          <Route path="showStudents" element={<ShowStudents />} />
          <Route path="editStudent/:id" element={<EditStudent />} />

          <Route path="showMyStudents" element={<ShowMyStudents />} />
          <Route path="showMyCourses" element={<ShowMyCourses />} />

          <Route path="addAcademician" element={<AddAcademician />} />
          <Route path="showAcademicians" element={<ShowAcademicians />} />
          <Route path="editAcademician/:id" element={<EditAcademician />} />

          <Route path="addExam" element={<AddExam />} />
          <Route path="showExams" element={<ShowExams />} />
          <Route path="editExam" element={<EditExam />} />

          <Route path="addCourse" element={<AddCourse />} />
          <Route path="showCourses" element={<ShowCourses />} />
          <Route path="editCourse/:id" element={<EditCourse />} />

          <Route path="grade" element={<Grade />} />
          <Route path="gradeExam" element={<GradeExam />} />

          <Route path="showStudentCourses" element={<ShowStudentCourses />} />
          <Route path="showStudentGrades" element={<ShowStudentGrades />} />
          <Route path="showStudentExams" element={<ShowStudentExams />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Navigate to="/" replace />} />
        <Route path="login/:type" element={<Login />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 3000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "#dddddd",
            color: "#111111",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;
