import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Container } from "../../components/container/container.component";
import Navbar from "../../components/navbar/navbar.component";

const Button = styled.button`
  padding: 0.8rem 1.6rem;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 16px;
  width: 13rem;
`;

// const Navbar = styled.nav`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 1rem 2rem;
//   background-color: darkblue;

//   .title {
//     font-size: 1.5rem;
//     color: white;
//   }

//   .text {
//     color: white;
//   }
// `;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Home = () => {
  const navigate = useNavigate();

  const sendLoginPage = (userType) => {
    navigate("/login/" + userType);
  };

  return (
    <>
      {/* <Navbar>
        <p className="title">Üniversite</p>
        <p className="text">Öğrenci Bilgi Sistemi</p>
      </Navbar> */}
      <Navbar />
      <Container>
        <Title>Öğrenci Bilgi Sistemi</Title>
        <Button
          className="bg-blue-950"
          onClick={() => {
            sendLoginPage("student");
          }}
        >
          Öğrenci Girişi
        </Button>
        <Button
          className="bg-blue-950"
          onClick={() => {
            sendLoginPage("academic");
          }}
        >
          Akademisyen Girişi
        </Button>
      </Container>
    </>
  );
};

export default Home;
