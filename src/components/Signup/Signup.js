import { fb } from "service";
import { useState } from "react";
import { FormField } from "components";
import { ErrorMessage, Formik, Form } from "formik";
import { useHistory } from "react-router-dom";
import { validationSchema, defaultValues } from "./formikConfig";
import { UserOutlined, LockOutlined, CommentOutlined } from "@ant-design/icons";
import loadingAnimation from "../../images/loading.svg";

export const Signup = () => {
    const history = useHistory();
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    function lowerLetters(str) {
        return str.toLowerCase();
    }

    const signup = ({ userName, password }, { setSubmitting }) => {
        setLoading(true)
        //@chat.engine is added to login because of Firebase requiring email string
        fb.auth
            .createUserWithEmailAndPassword(
                `${encodeURIComponent(lowerLetters(userName))}@chat.engine`,
                password
            )

            .then((res) => {
                console.log("Firebase account created");
            })

            .catch((err) => {
                if (err.code === "auth/email-already-in-use") {
                    setServerError("An account with this username already exists");
                } else {
                    setServerError(
                        "We're having trouble signing you up. Please try again."
                    );
                }
            })
            .finally(() => {
                setSubmitting(false)
                setLoading(false)
            });
    };
    return (
        <div className="auth-form signup-fields">
            <div className="logo">
                <CommentOutlined />
                <div className="logo-text">
                    <div className="logo-text-first">  Chat</div>
                    <div className="logo-text-second">     App</div>
                </div>
            </div>
            <Formik
                onSubmit={signup}
                validateOnMount={true}
                initialValues={defaultValues}
                validationSchema={validationSchema}
            >
                {({ isValid, isSubmitting }) => (
                    <Form>
                        <div className="login-fields ">

                            <div className="login-field">
                                <UserOutlined />
                                <FormField name="userName" placeholder="Username" />
                            </div>
                            <ErrorMessage component='div' name="userName" className="error" />
                            <div className="login-field">
                                <LockOutlined />
                                <FormField name="password" type="password" placeholder="Password" />
                            </div>
                            <ErrorMessage component='div' name="password" className="error" />
                            <div className="login-field">
                                <LockOutlined />
                                <FormField name="verifyPassword" placeholder="Verify Password" type="password" />
                            </div>
                            <ErrorMessage component='div' name="verifyPassword" className="error" />
                        </div>

                        {!loading ?
                            <button type="submit">
                                Sign Up
                            </button> : <div className="loading-image"><img src={loadingAnimation} alt="" /></div>}


                        <div className="auth-link-container already-account">
                            Already have an account?{" "}
                            <span className="auth-link signup-text" onClick={() => history.push("react-chat-app")}>
                                Log In!
                            </span>
                        </div>


                    </Form>
                )}
            </Formik>
            {!!serverError && <div className="error">{serverError}</div>}
        </div>
    );
};
