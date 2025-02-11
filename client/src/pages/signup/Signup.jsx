import React from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  // signup user
  const onSubmit = async (data, e) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: data.username.trim(),
            password: data.password.trim(),
          }),
        }
      );

      const result = await response.json();

      if (response.status === 200 && result.success) {
        navigate("/login");
      } else {
        setError("myForm", { type: "string", message: result.err });
      }
    } catch (error) {
      setError("myForm", { type: "string", message: error.message });
    }
  };

  return (
    <div className="signup">
      <div className="container">
        <h1>Sign Up</h1>
        <form className="myForm" onSubmit={handleSubmit(onSubmit)}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            {...register("username", {
              required: { value: true, message: "Username is required." },
              minLength: {
                value: 3,
                message: "Minimum 3 characters are required.",
              },
              maxLength: {
                value: 20,
                message: "Maximum 20 characters are allowed.",
              },
              validate: (value) => {
                if (!/^\S*$/.test(value)) {
                  return "Username cannot contain whitespace";
                }
                if (!/^[a-z0-9_]+$/.test(value)) {
                  return "Only lowercase letters, numbers, and underscores are allowed";
                }
              },
            })}
          />
          {errors.username && <p className="err">{errors.username.message}</p>}

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: { value: true, message: "Password is required." },
              minLength: {
                value: 8,
                message: "Minimum 8 characters are required.",
              },
            })}
          />
          {errors.password && <p className="err">{errors.password.message}</p>}
          <button
            className="btn"
            type="submit"
            {...register("myForm")}
            disabled={isSubmitting}
          >
            Submit
          </button>
          {errors.myForm && <p className="err">{errors.myForm.message}</p>}
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
