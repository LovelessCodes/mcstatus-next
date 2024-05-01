import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import { z } from 'zod';

const SignIn = () => {
    const { data: sessionData } = useSession();
    const email = z.string().email();
    const [ emailState, setEmailState ] = useState<string>("");

    const signMeIn = async () => await signIn("email", { email: emailState });

    if (sessionData != undefined) return <div>Loading...</div>;
    return (
        <>
            <input type="checkbox" id="sign-in" className="modal-toggle peer"/>
            <label htmlFor="sign-in" className="modal peer-checked:grid hidden">
                <label className="modal-box relative rounded-none">
                    <div className="flex flex-col p-10">
                        <label htmlFor="sign-in" className="absolute top-2 right-2 border-red-900 text-red-500 hover:text-base-200 hover:bg-red-500 transition-colors border rounded-none cursor-pointer">
                            <svg fill="none" height={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z" fill="currentColor"/> </svg>
                        </label>
                        <h2 className="text-2xl font-bold">Sign In</h2>
                        <p className="text-lg">Start by using any of our sign in flows:</p>
                        <div className="flex flex-col p-4">
                            <button onClick={() => signIn("discord")} className="w-full flex flex-row justify-between items-center group/discord border border-[#7289da] text-[#7289da] hover:text-base-200 hover:bg-[#7289da] p-2 transition-colors">
                                <p className="font-bold text-lg">Discord</p>
                                <div className="swap group-hover/discord:swap-active">
                                    <svg fill="none" className="swap-on" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z" fill="currentColor"/> </svg>
                                    <svg fill="none" className="swap-off" height={16} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M6 4h14v2h2v6h-8v2h6v2h-4v2h-2v2H2V8h2V6h2V4zm2 6h2V8H8v2z" fill="currentColor"/> </svg>
                                </div>
                            </button>
                        </div>
                        <div>
                            <p>or use your email:</p>
                            <input onChange={(e) => setEmailState(e.target.value)} value={emailState} className="peer w-full p-2 border border-primary opacity-50 focus:opacity-100 rounded-none" type="text" placeholder="test@test.com"/>
                            <p className={`mt-2 ${!email.safeParse(emailState).success && emailState.length > 0 ? "visible" : "invisible"} text-pink-600 text-sm`}>
                                Please provide a valid email address.
                            </p>
                        </div>
                        <div className="btn-group w-full">
                            <button className="btn btn-primary rounded-none w-1/2" disabled={!email.safeParse(emailState).success} onClick={() => {
                                if (email.safeParse(emailState).success) signMeIn();
                            }}>Sign in</button>
                            <label className="btn btn-ghost rounded-none w-1/2" htmlFor="sign-in">Cancel</label>
                        </div>
                    </div>
                </label>
            </label>
        </>
    )
}

export default SignIn;