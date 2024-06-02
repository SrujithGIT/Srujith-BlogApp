import React, { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { Form, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userAuthorLoginThunk } from "../../redux/slices/userauthorslice";
import './Signin.css';

function Signin() {
  let { register, handleSubmit, formState: { errors } } = useForm();
  let dispatch = useDispatch();
  let { loginUserStatus, currentUser, errorOccurred, errMsg } = useSelector(state => state.userAuthorLoginReducer);
  let navigate = useNavigate();

  function formSubmit(userCred) {
    console.log(userCred);
    dispatch(userAuthorLoginThunk(userCred));
  }

  useEffect(() => {
    if (loginUserStatus === true) {
      if (currentUser.userType === 'author') {
        navigate('/authorprofile');
      } else {
        navigate('/userprofile');
      }
    }
  }, [loginUserStatus, navigate, currentUser]);

  return (
    <div className="signin-container">
      <h1 className="text-center text-danger mb-4">Sign In</h1>
      <Form className="form-inline" onSubmit={handleSubmit(formSubmit)}>
        <div className="mb-4 text-center">
          <label htmlFor="user" className="form-check-label me-3 label-text">Login as</label>
          
          <div className="form-check form-check-inline">
            <input type="radio" className="form-check-input" id="user" value="user" {...register("userType")} />
            <label htmlFor="user" className="form-check-label">User</label>
          </div>
          <div className="form-check form-check-inline">
            <input type="radio" className="form-check-input" id="author" value="author" {...register("userType")} />
            <label htmlFor="author" className="form-check-label">Author</label>
          </div>
        </div>

        <div className="form-group mb-4">
          <label htmlFor="username" className="form-label text-danger">Username</label>
          <input type="text" className="form-control" id="username" {...register('username', { required: true, minLength: 4 })} />
          {errors.username?.type === 'required' && <p className="lead text-danger">Username is must required</p>}
          {errors.username?.type === 'minLength' && <p className="lead text-danger">Minimum length of 4</p>}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="password" className="form-label text-danger">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Password" {...register('password', { required: true })} />
          {errors.password?.type === 'required' && <p className="lead text-danger">Password is missing</p>}
        </div>

        <button type="submit" className="btn btn-primarybtn btn-outline-success mb-3">Login</button>
      </Form>
      <p className="text-center">New user? <Link to='/signup'>Sign up</Link></p>
    </div>
  );
}

export default Signin;
