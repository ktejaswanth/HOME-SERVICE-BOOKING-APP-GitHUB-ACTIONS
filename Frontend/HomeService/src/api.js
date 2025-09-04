// api.js

// Base URL for the backend API
export const BASEURL = "http://localhost:8080"; 
// Generic API caller function
export function callApi(reqmethod, url, data, responseHandler) {
  let options;

  if (reqmethod === "GET" || reqmethod === "DELETE") {
    options = {
      method: reqmethod,
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } else {
    options = {
      method: reqmethod,
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    };
  }

  fetch(url, options)
    .then(response => {
      if (!response.ok)
        throw new Error(`${response.status} ${response.statusText}`);
      return response.text(); // Expecting response in "200::message" format
    })
    .then(data => responseHandler(data))
    .catch(error => alert("API Error: " + error));
}

// Session management helpers
export function setSession(key, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  const sessionData = {
    value,
    expiry: expires.toISOString()
  };
  localStorage.setItem(key, JSON.stringify(sessionData));
}

export function getSession(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.toISOString() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}

export function clearSession(key) {
  localStorage.removeItem(key);
}

// Optional: Check if user is authenticated
export function isAuthenticated() {
  const token = getSession("csrid");
  return !!token;
}
