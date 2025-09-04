import React, { Component } from 'react';
import '../css/ProjectHomepage.css';
import withNavigation from './NavigateWrapper';
import { BASEURL, callApi, setSession } from '../api';

class HomeServicesHomepage extends Component {
  constructor() {
    super();
    this.state = {
      popupVisible: false,
      activeForm: 'signin',
    };
  }

  forgotPassword = (e) => {
    e.preventDefault(); // Fix: Prevent page reload

    const username = document.getElementById("username");
    const responseDiv = document.getElementById("responseDiv");

    username.style.border = "";
    responseDiv.innerHTML = "";

    if (username.value === "") {
      username.style.border = "1px solid red";
      username.focus();
      return;
    }

    const url = `${BASEURL}/users/forgotpassword/${username.value}`;
    callApi("GET", url, "", this.forgotPasswordResponse.bind(this));
  };

  forgotPasswordResponse(res) {
    const responseDiv = document.getElementById("responseDiv");
    const data = res.split("::");

    if (data[0] === "200") {
      responseDiv.innerHTML = `<br/><br/><label style="color:green">${data[1]}</label>`;
    } else {
      responseDiv.innerHTML = `<br/><br/><label style="color:red">${data[1]}</label>`;
    }
  }

  showSignin = () => {
    this.setState({ popupVisible: true, activeForm: 'signin' }, () => {
      setTimeout(() => {
        ["username", "password"].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = "";
        });
      }, 50);
    });
  };

  showSignUp = () => {
    this.setState({ popupVisible: true, activeForm: 'signup' }, () => {
      setTimeout(() => {
        ["fullname", "email", "service", "signuppassword", "confirmpassword"].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = "";
        });
      }, 50);
    });
  };

  closePopup = (e) => {
    if (e.target.id === "popup") {
      this.setState({ popupVisible: false });
    }
  };

  userRegistration = async () => {
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const service = document.getElementById("service").value;
    const password = document.getElementById("signuppassword").value;
    const confirm = document.getElementById("confirmpassword").value;

    if (!fullname || !email || !service || !password || !confirm) {
      alert("All fields are required.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${BASEURL}/users/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, service, password })
      });

      const result = await response.text();
      const [status, message] = result.split("::");
      alert(message);

      if (status === "200") this.showSignin();
    } catch (error) {
      alert("Registration failed. Server not reachable.");
    }
  };

  signin = () => {
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const responseDiv = document.getElementById("responseDiv");

    username.style.border = "";
    password.style.border = "";
    responseDiv.innerHTML = "";

    if (!username.value) {
      username.style.border = "1px solid red";
      return;
    }

    if (!password.value) {
      password.style.border = "1px solid red";
      return;
    }

    const data = JSON.stringify({
      email: username.value,
      password: password.value
    });

    callApi("POST", `${BASEURL}/users/signin`, data, this.signinResponse);
  };

  signinResponse = (res) => {
  const [status, msg] = res.split("::");
  const responseDiv = document.getElementById("responseDiv");

  if (status === "200") {
    const username = document.getElementById("username").value;

    setSession("csrid", msg, 1); // Store JWT or session info
    localStorage.setItem("userEmail", username); // ✅ Store email for later use

    if (username === "ktejaswanth05@gmail.com") {
      this.props.navigate("/admin");
    } else {
      this.props.navigate("/userhome");
    }
  } else {
    responseDiv.innerHTML = <label style="color:red">${msg}</label>;
  }
};

  goToAboutUs = () => this.props.navigate('/aboutus');
  goToFAQs = () => this.props.navigate('/faq');
  goToHiring = () => this.props.navigate('/hiring');

  render() {
    const { popupVisible, activeForm } = this.state;

    return (
      <div className="container" onClick={this.closePopup}>
        <div className="header">
          <div className="logo-placeholder"></div>
          <h1>HOME SERVICE BOOKING PLATFORM</h1>
        </div>

        <div className="main-content">
          <h2><em>Your Home, Our Expertise</em></h2>
          <p className="slogan">"Your satisfaction is our priority."<br />"We bring the service to your doorstep."</p>

          <div className="nav-buttons">
            <button>HOME</button>
            <button onClick={this.goToAboutUs}>ABOUT US</button>
            <button onClick={this.goToFAQs}>FAQ's</button>
            <button onClick={this.goToHiring}>Hirers</button>
            <button onClick={this.showSignin}>Sign In</button>
            <button onClick={this.showSignUp}>Sign Up</button>
          </div>

          <div className="services">
            <div className="service-card">
              <div className="service-header">Child and Elderly Care Services</div>
              <ul>
                <li>Babysitting</li>
                <li>Elderly care and companionship</li>
                <li>Housekeeping for seniors</li>
              </ul>
              <img src="./images/11.jpg" alt="Easy Booking" className="feature-icon" />
            </div>
            <div className="service-card">
              <div className="service-header">Moving and Storage</div>
              <ul>
                <li>Local and long-distance moving</li>
                <li>Packing and unpacking services</li>
                <li>Storage solutions</li>
              </ul>
              <img src="./images/2.jpg" alt="Easy Booking" className="feature-icon" />
            </div>
            <div className="service-card">
              <div className="service-header">Cleaning Services</div>
              <ul>
                <li>Residential cleaning</li>
                <li>Deep cleaning</li>
                <li>Carpet and upholstery cleaning</li>
                <li>Window cleaning</li>
                <li>Pressure washing</li>
              </ul>
              <img src="./images/5.jpg" alt="Easy Booking" className="feature-icon" />
            </div>
          </div>
        </div>

        {popupVisible && (
          <div id="popup">
            <div className="popupWindow">
              <div id="popupHeader">{activeForm === "signin" ? "Login" : "Signup"}</div>

              {activeForm === "signin" ? (
                <div id="signin">
                  <label>Username:</label>
                  <input type="text" id="username" />
                  <label>Password:</label>
                  <input type="password" id="password" />
                  <button className="signinButton" onClick={this.signin}>Sign In</button>
                  <div id="responseDiv" className="responseDiv"></div>
                  <p><a href="/" onClick={this.forgotPassword}>Forgot Password?</a></p>
                  <p className="switch-link">Don't have an account? <span onClick={this.showSignUp}>SIGN UP NOW</span></p>
                </div>
              ) : (
                <div id="Signup">
                  <label>Full Name:</label>
                  <input type="text" id="fullname" />
                  <label>Email:</label>
                  <input type="email" id="email" />
                  <label>Select Service:</label>
                  <select id="service">
                    <option value=""></option>
                    <option value="Customer">Customer</option>
                    <option value="Serviceprovider">Service Provider</option>
                  </select>
                  <label>Password:</label>
                  <input type="password" id="signuppassword" />
                  <label>Confirm Password:</label>
                  <input type="password" id="confirmpassword" />
                  <button className="signupButton" onClick={this.userRegistration}>Register Now</button>
                  <p className="switch-link">Already have an account? <span onClick={this.showSignin}>SIGN IN</span></p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="footer">
          <p>Copyright@Home Services - All Rights Reserved</p>
        </div>
      </div>
    );
  }
}

export default withNavigation(HomeServicesHomepage);
