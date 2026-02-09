// src/utils/token.js

export const setTokens = ({ accessToken, refreshToken }) => {
  sessionStorage.setItem("accessToken", accessToken);
  sessionStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => {
  return sessionStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return sessionStorage.getItem("refreshToken");
};

export const clearTokens = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
};
