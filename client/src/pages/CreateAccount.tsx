// import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
// import auth from "../utils/auth";
// import type { User } from "../models/User";
// import { useMutation } from "@apollo/client";
// import { LOGIN_USER } from "../utils/mutations";

const CreateAccount = () => {
  return (
    <>
      {/* Main content where the form questions are presented
      <main className="flex-shrink-0">
        {!loginCheck ? (
          <div className="login-notice">
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <h4>Username</h4>
              <input
                type="text"
                name="username"
                className="form-control form-custom-1"
                value={loginData.username || ""}
                onKeyDown={handleKeyDown}
                onChange={handleLoginChange}
              />
              <h4>Password</h4>
              <input
                type="password"
                name="password"
                className="form-control form-custom-1"
                value={loginData.password || ""}
                onKeyDown={handleKeyDown}
                onChange={handleLoginChange}
              />
              <h4>Email</h4>
              <input
                type="text"
                name="email"
                className="form-control form-custom-1"
                value={loginData.email || ""}
                onKeyDown={handleKeyDown}
                onChange={handleLoginChange}
              />
              <h4>Role</h4>
              <select
                name="role"
                className="form-control form-custom-1"
                onKeyDown={handleKeyDown}
                onChange={handleLoginChange}
              >
                <option value="supervisor">Supervisor</option>
                <option value="employee">Employee</option>
              </select>
            </form>
            <h3
              className="login-error"
              style={{ display: loginError ? "block" : "none" }}
            >
              Invalid username and/or password!
            </h3>
            <button
              type="submit"
              className="btn  btn-lg btn-block btn-custom-1"
              onClick={handleLoginSubmit}
            >
              Login
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </main> */}
    </>
  );
};

export default CreateAccount;
