import styled from "styled-components";
import { useUserContext } from "../../contexts/useUser.context";
import { useNavigate } from "react-router-dom";

const StyledNavbar = styled.nav`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5vh;
  width: 100%;
  .title {
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    margin-right: 10px;
  }

  .text {
    color: white;
    font-size: 1.2rem;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserContext();

  const handleLogin = () => {
    logout();
    navigate("/");
  };
  return (
    <StyledNavbar className="bg-blue-950">
      <h1 className="title">X Üniversitesi</h1>
      {user && (
        <button className="text" onClick={handleLogin}>
          Logout
        </button>
      )}
    </StyledNavbar>
  );
};

export default Navbar;
