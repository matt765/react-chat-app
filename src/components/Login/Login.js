import { fb, facebookProvider, googleProvider } from "service";
import { useState } from "react";
import { FormField } from "components";
import { ErrorMessage, Formik, Form } from "formik";
import { useHistory } from "react-router-dom";
import { defaultValues, validationSchema } from "./formikConfig";
import { GoogleOutlined, FacebookOutlined, UserOutlined, LockOutlined, CommentOutlined } from "@ant-design/icons";
import loadingAnimation from "../../images/loading.svg";

export const Login = () => {
  const [serverError, setServerError] = useState("");
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  function lowerLetters(str) {
    return str.toLowerCase();
  }
  const login = ({ userName, password }, { setSubmitting }) => {
    setLoading(true)
    // @chat.engine is added to login because of Firebase requiring email string
    fb.auth
      .signInWithEmailAndPassword(
        `${encodeURIComponent(lowerLetters(userName))}@chat.engine`,
        password
      )
      .then((res) => {
        
        if (!res.user) {
          setServerError(
            "We're having trouble logging you in. Please try again."
          );
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.code === "auth/wrong-password") {
          setServerError("Username or password is invalid");
        } else if (err.code === "auth/user-not-found") {
          setServerError("No account for this username");
        } else {
          setServerError("Something went wrong :(");
        }
      })
      .finally(() => {
        setSubmitting(false)
        setLoading(false)
      });
  };

  return (
    <div className="auth-form">
      <div className="logo">
        <CommentOutlined />
        <div className="logo-text">
          <div className="logo-text-first">  Chat</div>
          <div className="logo-text-second">     App</div>
        </div>
      </div>

      <Formik
        onSubmit={login}
        validateOnMount={true}
        initialValues={defaultValues}
        validationSchema={validationSchema}
      >
        {({ isValid, isSubmitting }) => (
          <Form>
            <div class="login-fields">
              <div class="login-field">
                <UserOutlined />
                <FormField name="userName" placeholder="Username"  /></div>
                <ErrorMessage component='div' name="userName" className="error" /> <br />
              <div class="login-field">
                <LockOutlined />
                <FormField name="password" placeholder="Password" type="password" />
              </div>
              <ErrorMessage component='div' name="password" className="error" />
            </div>
            <div className="auth-link-container">
              Don't have an account?{" "}
              <span
                className="auth-link"
                onClick={() => history.push("signup")}
                className="signup-text"
              >
                Sign Up!
              </span>
            </div>
            {!loading ? 
            <button type="submit">
              Login
            </button> : <div className="loading-image"><img src={loadingAnimation} alt=""  /></div>}

            {!!serverError && <div className="error server-error">{serverError}</div>}
          </Form>
        )}
      </Formik>

      <div className="social-media">
        <div className="social-media-header">
          <hr /> Login with social media<hr />
        </div>
        <div className="social-login">
          <div
            className="google"
            onClick={() => fb.auth.signInWithRedirect(googleProvider)}
          >
            <GoogleOutlined /> Google
          </div>
          <div
            className="google"
            onClick={() => fb.auth.signInWithRedirect(facebookProvider)}
          >
            <FacebookOutlined /> Facebook
          </div>
        </div>
      </div>
    </div>
  );
};
