import { useState } from "react";
import Header from "~/components/header";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { AuthSchema } from "~/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLoginHandler } from "~/service/api";

type AuthFormData = z.infer<typeof AuthSchema>

export default function AuthPage() {

    const [isSignup, setIsSignup] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthFormData>({
        resolver: zodResolver(AuthSchema),
    })

    const onSubmit = async (data: AuthFormData) => {
        // console.log(data);
    };

    const handleGoogleLogin = useGoogleLoginHandler()

    
    return (
        <div>
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-black">
                        {/* {isSignup ? "Create an account" : "Welcome back"} */}
                    </h2>
                    {/* <form
                        className="space-y-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-3 rounded-md border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-3 rounded-md border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition cursor-pointer"
                        >
                            {isSignup ? "Sign Up" : "Login"}
                        </button>
                    </form> */}
{/* 
                    <p className="text-center text-sm text-gray-600 mt-4">
                        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            onClick={() => setIsSignup(!isSignup)}
                            className="text-black font-semibold hover:underline"
                        >
                            {isSignup ? "Login" : "Sign Up"}
                        </button>
                    </p> */}

                    {/* <div className="my-6 border-t border-gray-300 text-center relative">
                        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-gray-500 text-sm">
                            OR
                        </span>
                    </div> */}

                    <div className="flex justify-center">

                        <GoogleLogin
                            onSuccess={(res) => handleGoogleLogin(res.credential)}
                            onError={() => console.log('Login Failed')}
                        />
                        {/* <FaGoogle size={25} color="black" className="mr-10 cursor-pointer" /> */}
                        {/* <FaGithub size={25} color="black" className="mr-2 cursor-pointer" /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
