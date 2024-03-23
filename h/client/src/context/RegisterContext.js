import React, { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  registering: false,
  registrationError: null,
  registrationData: JSON.parse(localStorage.getItem("registrationData")) || null,
};

export const RegisterContext = createContext(INITIAL_STATE);

const RegisterReducer = (state, action) => {
  switch (action.type) {
    case "REGISTER_START":
      return {
        ...state,
        registering: true,
        registrationError: null,
        registrationData: null,
      };
    case "REGISTER_SUCCESS":
      return {
        registering: false,
        registrationError: null,
        registrationData: action.payload,
      };
    case "REGISTER_FAILURE":
      return {
        ...state,
        registering: false,
        registrationError: action.payload,
        registrationData: null,
      };
    case "LOGOUT":
      return {
        ...state,
        registrationData: null,
      };
    default:
      return state;
  }
};

export const RegisterContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(RegisterReducer, INITIAL_STATE);

  // Save registration data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("registrationData", JSON.stringify(state.registrationData));
  }, [state.registrationData]);

  // Clear registration data from localStorage on logout
  useEffect(() => {
    const handleLogout = () => {
      dispatch({ type: "LOGOUT" });
    };

    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  return (
    <RegisterContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};
