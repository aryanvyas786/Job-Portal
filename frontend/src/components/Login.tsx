import React from 'react';
import './Login.css';
import { Link, useNavigate, useParams } from 'react-router-dom'; 
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Login: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const schema = Yup.object().shape({
    email: Yup.string()
      .required("Email is a required field"),
    password: Yup.string()
      .required("Password is a required field")
      .min(8, "Password must be at least 8 characters"),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await axios.post('http://localhost:9000/api/login', values);
    //   localStorage.setItem('token', response.data.token);
    const token = response.data.token;  // Assuming the API response contains the token
    localStorage.setItem('token', token);  // Save the token in localStorage
    // console.log("Token stored:", token);
    console.log(response.data.user)
    alert("Login Successfully Done");
        navigate(`/dashboard`);
    } catch (error) {
      console.error("Error Fetching Error", error);
    }
  };

  return (
    <>
      <Formik
        validationSchema={schema}
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => {
          return (
            <div className="login">
              <div className="form">
                <form noValidate onSubmit={handleSubmit}>
                  <span>Login</span>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email id / username"
                    className="form-control inp_text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <p>{errors.email && touched.email && errors.email}</p>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    className="form-control"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  <p>{errors.password && touched.password && errors.password}</p>

                  <Link to="/forgetPassword" style={{ display: 'block', marginTop: '10px' }}>
                    Forget Password?
                  </Link>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="form-button"
                    style={{
                      padding: "10px",
                      background: "#4b6cb7",
                      border: "none",
                      borderRadius: "3px",
                      color: "#fff",
                      cursor: "pointer",
                      marginTop: "15px",
                    }}
                  >
                    Submit
                  </button>
                </form>
              </div>
              <center>
                <Link to="/">
                  <button
                    style={{
                      padding: "10px",
                      background: "#1e85a6",
                      border: "none",
                      borderRadius: "3px",
                      color: "#a4d9ea",
                      cursor: "pointer",
                      marginLeft:'40%'
                    }}
                  >
                    Click here to Register
                  </button>
                </Link>
              </center>
            </div>
          );
        }}
      </Formik>
    </>
  );
};

export default Login;
