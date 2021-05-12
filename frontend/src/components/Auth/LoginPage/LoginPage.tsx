import {Link, useHistory} from "react-router-dom";
import {useForm} from "react-hook-form";
import Cookies from 'universal-cookie';
import React, {useState} from 'react';
import axios from "axios";

const LoginPage = () => {

    const {register, handleSubmit, watch, formState: {errors}} = useForm()
    const [passwordShown, setPasswordShown] = useState(false)
    let history = useHistory();

    const onSubmit = (data: any) => {
        let payload = {email: data.Email, password: data.Password}
        const cookies = new Cookies()
        axios.post('http://127.0.0.1:8000/api/auth/login', payload).then(r => {
            cookies.set('Token', r.data.token, {path: '/'})
            cookies.set('User_ID', r.data.user.id, {path: '/'})
            history.push('')
            window.location.reload()
        }).catch(err => console.log(err))
    }

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown)
    }

    return (
        <>
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <form method="post" className="login100-form validate-form" onSubmit={handleSubmit(onSubmit)}>
                            <span className="login100-form-title p-b-26">
                                Welcome
                            </span>
                            <span className="login100-form-title p-b-48">
                                <i className="zmdi zmdi-font"/>
					        </span>

                            <div className="wrap-input100 validate-input">
                                {errors.Email &&
                                <div className="txt2 validate-input-alert">You have entered an invalid email
                                    address!</div>}
                                <input className="input100" type="text" placeholder="Email" {...register("Email", {
                                    required: true,
                                    pattern: /^\S+@\S+$/i
                                })} />
                                <span className="focus-input100"/>
                            </div>

                            <div className="wrap-input100 validate-input">
                                <span className="btn-show-pass">
                                    <i className="zmdi zmdi-eye" onClick={togglePasswordVisibility}/>
                                </span>
                                {errors.Password &&
                                <div className="txt2 validate-input-alert">
                                    <li>Passwords must have at least one uppercase['A'-'Z']</li>
                                    <li>Passwords must have at least one digit['0'-'9']</li>
                                    <li>Passwords must have at least one special symbol[#?!@$%^&*-]</li>
                                </div>}
                                <input className="input100" type={passwordShown ? "text" : "password"}
                                       placeholder="Password" {...register("Password", {
                                    required: true,
                                    minLength: 8,
                                    maxLength: 80,
                                    pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
                                })} />
                                <span className="focus-input100"/>
                            </div>

                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"/>
                                    <button className="login100-form-btn" type="submit">
                                        Login
                                    </button>
                                </div>
                            </div>

                            <div className="text-center p-t-115">
                                <span className="txt1">
                                    Don’t have an account?
                                </span>
                                <Link className="txt2 mx-1" to="signup">
                                    Sign Up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
