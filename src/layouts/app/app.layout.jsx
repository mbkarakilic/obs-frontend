import styled from "styled-components";
import Sidebar from "../../components/sidebar/sidebar.component";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/navbar.component";

const StyledAppLayout = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 15rem 1fr;
`;

const Main = styled.main`
  height: 100vh;
`;

const Container = styled.div`
  height: 95vh;
  width: 100%;
  background-color: #dddddd;
`;

const AppLayout = () => {
  return (
    <StyledAppLayout>
      <Sidebar />
      <Main>
        <Navbar />
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
};

export default AppLayout;
