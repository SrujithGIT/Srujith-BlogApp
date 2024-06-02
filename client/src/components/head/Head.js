import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetState } from "../../redux/slices/userauthorslice";
import { FaHome } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { GiArchiveRegister } from "react-icons/gi";
import './Head.css';

function Head() {
  let { loginUserStatus, currentUser } = useSelector(state => state.userAuthorLoginReducer);
  let dispatch = useDispatch();

  function signOut() {
    localStorage.removeItem('token');
    dispatch(resetState());
  }

  return (
    <div className="navbar-container">
      <ul className="nav justify-content-end">
        {loginUserStatus === false ? (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" to="">
                <FaHome className="fs-1"/>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="signup">
                <GiArchiveRegister className="fs-1" /> Signup
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="signin">
                <FiLogIn className="fs-1" /> Signin
              </NavLink>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <p className="welcome-text">Welcome, {currentUser.username}</p>
            <NavLink className="nav-link" to="signin" onClick={signOut}>
              Signout
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Head;
