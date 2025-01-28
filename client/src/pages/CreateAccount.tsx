import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import auth from "../utils/auth";
import type { User } from "../models/User";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";

const CreateAccount = () => {
  const [loginCheck, setLoginCheck] = useState(false);
  const [addUserError, setAddUserError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [roleError, setRoleError] = useState(false);
  const [formError, setFormError] = useState(false);
  const [successUser, setSuccessUser] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const checkLogin = () => {
    const isLoggedIn = auth.loggedIn();
    if (isLoggedIn) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const [addUser] = useMutation(ADD_USER);

  const [newUserData, setNewUserData] = useState<User>({
    username: "",
    password: "",
    email: "",
    role: "",
  });

  const handleAddUserChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAddUserError(false);
    setUsernameError(false);
    setPasswordError(false);
    setFormError(false);
    setSuccessUser(false);
    const { name, value } = e.target;
    setNewUserData({
      ...newUserData,
      [name]: value,
    });
  };

  const handleAddUserSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const uname = newUserData.username;
      const password = newUserData.password;
      const em = newUserData.email;
      const role = newUserData.role;
      if (!uname && !password && !em && !role) {
        setFormError(true);
      } else if (!uname) {
        setUsernameError(true);
      } else if (!password) {
        setPasswordError(true);
      } else if (!em) {
        setEmailError(true);
      } else if (!role) {
        setRoleError(true);
      }

      if (!usernameError && !passwordError && !emailError && !roleError) {
        const { data } = await addUser({
          variables: { uname, em, role, password },
        });
        if (!data.addUser) {
          setAddUserError(true);
        } else {
          setSuccessUser(true);
        }
      }
    } catch (err) {
      console.error("Failed to login", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddUserSubmit(e);
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //const value = Number(event.target.value);
    setRoleError(false);
    setNewUserData({
      ...newUserData,
      role: event.target.value,
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailError(false);
    setNewUserData({
      ...newUserData,
      email: e.target.value,
    });
  };

  return (
    <>
      {/* Main content where the form questions are presented */}
      <main className="flex-shrink-0">
        {loginCheck && auth.getRole() === "supervisor" ? (
          <div className="login-notice">
            <form className="login-form" onSubmit={handleAddUserSubmit}>
              <h4>Username</h4>
              <input
                type="text"
                name="username"
                className="form-control form-custom-1"
                placeholder="Enter unique username"
                value={newUserData.username || ""}
                onKeyDown={handleKeyDown}
                onChange={handleAddUserChange}
              />
              <h4>Password</h4>
              <input
                type={showPassword ? "text" : "password"} // Conditional input type
                name="password"
                className="form-control form-custom-1"
                value={newUserData.password || ""}
                onKeyDown={handleKeyDown}
                onChange={handleAddUserChange}
              />
              {/* Button below the input */}
              <button
                type="button"
                className="btn btn-link mt-2 text-white"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>
              <h4>Email</h4>
              <input
                type="text"
                name="email"
                className="form-control form-custom-1"
                placeholder="Enter valid & unique email"
                value={newUserData.email || ""}
                onKeyDown={handleKeyDown}
                onChange={handleEmailChange}
              />
              <h4>Role</h4>
              <select
                id="role-select"
                className="form-select mb-3 form-custom-1"
                aria-label=".form-select example"
                onChange={handleRoleChange}
              >
                <option selected>Choose role</option>
                <option value="supervisor">Supervisor</option>
                <option value="employee">Employee</option>
              </select>
            </form>
            <h3
              className="addUser-error"
              style={{ display: addUserError ? "block" : "none" }}
            >
              Invalid new user credentials! Check if username/email are unqiue
              and email is in the correct form.
            </h3>
            <h3
              className="addUser-error"
              style={{ display: usernameError ? "block" : "none" }}
            >
              Please enter username! Check to make sure username is unqiue.
            </h3>
            <h3
              className="addUser-error"
              style={{ display: passwordError ? "block" : "none" }}
            >
              Please enter password!
            </h3>
            <h3
              className="addUser-error"
              style={{ display: emailError ? "block" : "none" }}
            >
              Please enter email! Check to make sure email is unqiue & valid.
            </h3>
            <h3
              className="addUser-error"
              style={{ display: roleError ? "block" : "none" }}
            >
              Please select role!
            </h3>
            <h3
              className="addUser-error"
              style={{ display: formError ? "block" : "none" }}
            >
              Please fill out form before submitting!
            </h3>
            <button
              type="submit"
              className="btn btn-lg btn-block btn-custom-1"
              onClick={handleAddUserSubmit}
            >
              Create an Account
            </button>
            <h3
              className="success-user"
              style={{ display: successUser ? "block" : "none" }}
            >
              User Successfully Created!
            </h3>
          </div>
        ) : (
          <h1 style={{ marginTop: "20px" }}>
            Unauthorized user! Please login as supervisor to access this page.
          </h1>
        )}
      </main>
    </>
  );
};

export default CreateAccount;
