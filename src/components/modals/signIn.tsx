import { signIn, useSession } from 'next-auth/react'

const SignIn = ({ providers }: { providers: (string | null)[] }) => {
    const { data: sessionData } = useSession()

    if (sessionData !== undefined) return <div>Loading...</div>
    return (
        <>
            <input type="checkbox" id="sign-in" className="modal-toggle peer" />
            <label htmlFor="sign-in" className="modal peer-checked:grid hidden">
                <label className="modal-box relative rounded-none">
                    <div className="flex flex-col p-10">
                        <label
                            htmlFor="sign-in"
                            className="absolute top-2 right-2 border-red-900 text-red-500 hover:text-base-200 hover:bg-red-500 transition-colors border rounded-none cursor-pointer"
                        >
                            <svg
                                fill="none"
                                height={24}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                {' '}
                                <path
                                    d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
                                    fill="currentColor"
                                />{' '}
                            </svg>
                        </label>
                        <h2 className="text-2xl font-bold">Sign In</h2>
                        <p className="text-lg">
                            Start by using any of our sign in flows:
                        </p>
                        <div className="flex flex-col p-4 gap-4">
                            {providers?.map((provider) => {
                                if (provider === 'discord') {
                                    return (
                                        <button
                                            key="discord"
                                            type="button"
                                            onClick={() => signIn('discord')}
                                            className="w-full flex flex-row justify-between items-center group/discord border border-[#7289da] text-[#7289da] hover:text-base-200 hover:bg-[#7289da] p-2 transition-colors"
                                        >
                                            <p className="font-bold text-lg">
                                                Discord
                                            </p>
                                            <div className="swap group-hover/discord:swap-active">
                                                <svg
                                                    fill="none"
                                                    className="swap-on"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                >
                                                    {' '}
                                                    <path
                                                        d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z"
                                                        fill="currentColor"
                                                    />{' '}
                                                </svg>
                                                <svg
                                                    fill="none"
                                                    className="swap-off"
                                                    height={16}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                >
                                                    {' '}
                                                    <path
                                                        d="M6 4h14v2h2v6h-8v2h6v2h-4v2h-2v2H2V8h2V6h2V4zm2 6h2V8H8v2z"
                                                        fill="currentColor"
                                                    />{' '}
                                                </svg>
                                            </div>
                                        </button>
                                    )
                                }
                                if (provider === 'github') {
                                    return (
                                        <button
                                            key="github"
                                            type="button"
                                            onClick={() => signIn('github')}
                                            className="w-full flex flex-row justify-between items-center group/github border border-[#4078c0] text-[#4078c0] hover:text-base-200 hover:bg-[#7289da] p-2 transition-colors"
                                        >
                                            <p className="font-bold text-lg">
                                                GitHub
                                            </p>
                                            <div className="swap group-hover/github:swap-active">
                                                <svg
                                                    fill="none"
                                                    className="swap-on"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                <svg
                                                    className="swap-off"
                                                    height={16}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <title>GitHub</title>
                                                    <path
                                                        fill="currentColor"
                                                        d="M5 2h4v2H7v2H5V2Zm0 10H3V6h2v6Zm2 2H5v-2h2v2Zm2 2v-2H7v2H3v-2H1v2h2v2h4v4h2v-4h2v-2H9Zm0 0v2H7v-2h2Zm6-12v2H9V4h6Zm4 2h-2V4h-2V2h4v4Zm0 6V6h2v6h-2Zm-2 2v-2h2v2h-2Zm-2 2v-2h2v2h-2Zm0 2h-2v-2h2v2Zm0 0h2v4h-2v-4Z"
                                                    />
                                                </svg>
                                            </div>
                                        </button>
                                    )
                                }
                            })}
                        </div>
                    </div>
                </label>
            </label>
        </>
    )
}

export default SignIn
