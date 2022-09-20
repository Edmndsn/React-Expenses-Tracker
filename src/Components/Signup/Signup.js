import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase-config";
import { useAuth } from "../../Contexts/AuthContext.js";
import Logo from "../../images/Logo.svg";
import google from "../../images/Google.svg";
import vector from "../../images/Vector.svg";
import Main from "../../images/Intro_img.svg";
import "../../Components/Signin/signin.css"


export default function Signup() {
  const { signup, setDisplayName, createUserDetails } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errorMessage).length === 0) {
      try {
        setLoading(true);
        const { user } = await signup(data.email, data.password);
        await setDisplayName(user, data.name);
        await createUserDetails(user.uid, data.name, data.email);
        navigate("/", { replace: true });
      } catch (err) {
        setErrorMessage({ name: "Failed to create an account" });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setErrorMessage({});
    if (data.password.length < 6 && data.password !== "") {
      setErrorMessage((prev) => ({
        ...prev,
        password: "Password is too short",
      }));
    }
    if (!/.+@.+\..+/.test(data.email) && data.email !== "") {
      setErrorMessage((prev) => ({
        ...prev,
        email: "Email is incorrect",
      }));
    }
    if (!/^[a-zA-Z\s]+$/g.test(data.name) && data.name !== "") {
      setErrorMessage((prev) => ({
        ...prev,
        name: "Name can contain only letters",
      }));
    }
  }, [data]);

  function handleGoogle(e) {
    e.preventDefault();
    signInWithPopup(auth, provider)
      .then((cred) => {
        console.log(cred);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="intro-container">
      <div className="form-half">
        <div className="form-container">
          <img src={Logo} className="su-logo" alt="logo" />
          <h1 className="title-sign">Create a new account.</h1>
          <p className="details">Please enter your details.</p>
          <form className="form-signup" onSubmit={handleSubmit}>
            <div className="label-container">
              <label className="name-label">Full Name</label>
              {errorMessage.name && (
                <label className="errorMessage name">{errorMessage.name}</label>
              )}
            </div>
            <input
              className="details-input"
              type="text"
              name="name"
              onChange={handleChange}
              value={data.name}
              placeholder="Enter your full name"
            />
            <div className="label-container">
              <label className="email-label">Email</label>
              {errorMessage.email && (
                <label className="errorMessage email">
                  {errorMessage.email}
                </label>
              )}
            </div>
            <input
              className="details-input"
              type="email"
              name="email"
              onChange={handleChange}
              value={data.email}
              placeholder="Enter your email address"
            />
            <div className="label-container">
              <label className="password-label">Password</label>
              {errorMessage.password && (
                <label className="errorMessage password">
                  {errorMessage.password}
                </label>
              )}
            </div>

            <input
              className="details-input"
              type="password"
              name="password"
              onChange={handleChange}
              value={data.password}
              placeholder="·······"
            />
            <button onClick={handleSubmit} className="sign-btn">
              Sign up
            </button>
            <button className="google-btn" onClick={handleGoogle}>
              <img src={google} alt="google" />
              Sign up with google
            </button>
            <p className="question">
              Already have an account? <Link to="/signin">Sign in</Link>
            </p>
            <img className="su-vector" src={vector} alt="vector" />
          </form>
        </div>
      </div>
      <div className="image-half">
        <img src={Main} alt="" className="landing" />
      </div>
    </div>
  );
}
