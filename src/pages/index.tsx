import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import type { BedrockStatusResponse, JavaStatusResponse } from 'node-mcstatus';
import { useEffect, useReducer, useState } from 'react';
import { AddModal, DeleteModal, SignInModal } from '~/components/modals';
import { env } from '~/env.mjs';
import { api } from '~/utils/api';
import { copyIP } from '~/utils/helpers';

type MCStatus = JavaStatusResponse | BedrockStatusResponse;

export const getServerSideProps = (async () => {
    return {
        props: {
            title: env.PAGE_TITLE as string ?? "Minecraft Server",
            description: env.PAGE_DESCRIPTION as string ?? "Minecraft Server Status Dashboard",
            favicon: env.FAVICON_URL as string ?? "/favicon.ico",
        }
    };
}) satisfies GetServerSideProps<{ title: string, description: string, favicon: string }>;

function Home({ title, description, favicon }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // Next Auth
    const { data: sessionData } = useSession();
    
    // tRPC Queries
    const {data: routes, isLoading: isRoutesLoading, isFetching: isRoutesFetching} = api.route.routes.useQuery(undefined, { enabled: true });
    const {data: privRoutes} = api.route.privRoutes.useQuery(undefined, { enabled: sessionData?.user != undefined });

    // tRPC Mutations
    const mutation = api.status.status.useMutation({
        onSuccess(data) {
            if (data) dispatch({ type: "ADD", payload: data });
        }
    });

    // States
    const [ deleteRoute, setDeleteRoute ] = useState<string>("");

    // Reducers
    const reducer = (state: MCStatus[], action: { type: string; payload: MCStatus }) => {
        switch (action.type) {
            case "ADD":
                return [...state, action.payload];
            default:
                return state;
        }
    }
    const [servers, dispatch] = useReducer(reducer, []);

    // Effects
    useEffect(() => {
        if (!!Array.isArray(routes)) {
            routes.filter(
                (route: { address: string }) => servers.findIndex((server: MCStatus) => server.host === route.address) === -1
            ).forEach((route: { address: string; backend?: string; }) => {
                mutation.mutateAsync({ address: route.address, type: "java" });
            });
        }
    }, [routes]);
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description}/>
                <link rel="icon" href={favicon} />
            </Head>
            <main className="h-screen w-screen justify-center flex flex-col items-between overflow-hidden">

                <div className="stats rounded-none bg-gradient-to-br from-primary to-base-100 text-primary-content lg:h-[10%] h-[15%]">
                    <div className="stat">
                        <div className="stat-title text-slate-200">Total Servers</div>
                        <div className="stat-value text-slate-200">{routes?.length ?? 0}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title text-slate-200">Active Servers</div>
                        <div className="stat-value text-slate-200">{servers?.filter((s: MCStatus) => s.online)?.length ?? 0}</div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 grid-cols-1 lg:h-[90%] h-[85%] w-full">
                    <div className="lg:col-start-0 lg:col-span-3 col-span-1 h-full flex flex-col justify-between bg-base-200">
                        <div>
                            <div className="flex flex-row w-full justify-between pl-8 py-4 pr-8 items-center">
                                <h3 className="text-4xl font-bold">Servers</h3>
                                {sessionData?.user &&
                                    <div className="swap cursor-pointer hover:swap-active" onClick={() => document.getElementById("add-route")?.click()}>
                                        <div className="swap-on text-green-400 tooltip tooltip-top tooltip-open" data-tip="Add a new server">
                                            <svg height={36} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4z" fill="currentColor"/> </svg>
                                        </div>
                                        <svg height={36} className="swap-off opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zm-6-8h4v2h-4v4h-2v-4H7v-2h4V7h2v4z" fill="currentColor"/> </svg>
                                    </div>
                                }
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="table table-sm">
                                    <tbody>
                                        {Array.isArray(routes) && routes.map((route: { address: string }, i: number) => {
                                            const server = servers?.find((server: MCStatus) => server.host == route.address);
                                            return <tr key={`all-servers-${i}`}>
                                                <td>{i+1}</td>
                                                <td>{route.address}</td>
                                                <td>
                                                <div className={`rounded-full h-3 w-3 ${server != undefined ? (server.online ? 'bg-green-500' : 'bg-red-700') : 'bg-base-100'}`}></div>
                                                </td>
                                                {sessionData?.user &&
                                                    <td>
                                                    <div className="flex flex-row gap-2 items-center">
                                                        {/* Edit button */}
                                                        <svg className="hover:cursor-pointer hover:text-lime-200 transition-colors" fill="none" xmlns="http://www.w3.org/2000/svg" height={18} viewBox="0 0 24 24"> <path d="M18 2h-2v2h2V2zM4 4h6v2H4v14h14v-6h2v8H2V4h2zm4 8H6v6h6v-2h2v-2h-2v2H8v-4zm4-2h-2v2H8v-2h2V8h2V6h2v2h-2v2zm2-6h2v2h-2V4zm4 0h2v2h2v2h-2v2h-2v2h-2v-2h2V8h2V6h-2V4zm-4 8h2v2h-2v-2z" fill="currentColor"/> </svg>
                                                        {/* Delete button */}
                                                        <svg onClick={
                                                        () => {
                                                            setDeleteRoute(route.address);
                                                            document.getElementById("delete-route")?.click();
                                                        }
                                                        } height={24} className="hover:cursor-pointer hover:text-red-500 transition-colors" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M21 5H7v2H5v2H3v2H1v2h2v2h2v2h2v2h16V5h-2zM7 17v-2H5v-2H3v-2h2V9h2V7h14v10H7zm8-6h-2V9h-2v2h2v2h-2v2h2v-2h2v2h2v-2h-2v-2zm0 0V9h2v2h-2z" fill="currentColor"/> </svg>
                                                    </div>
                                                    </td>
                                                }
                                            </tr>;
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {sessionData?.user ?
                            <button onClick={() => signOut({ redirect: false })} className="flex flex-row justify-between items-center p-4 border group border-red-500 text-red-500 w-full hover:cursor-pointer hover:text-base-200 hover:bg-red-500 transition-colors">
                                <p>Sign out</p>
                                <label className="swap group-hover:swap-active text-6xl">
                                    <div className="swap-on"><svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M10 3H8v2H6v2h2V5h2v2h2v2h-2v2H8v2H6v2H4v-2H2v2h2v2h2v-2h4v2h2v2h-2v2h2v-2h2v-2h-2v-4h2v-2h2v2h2v2h2v-2h2v-2h-2v2h-2v-2h-2V9h2V5h-4v2h-2V5h-2V3z" fill="currentColor"/> </svg></div>
                                    <div className="swap-off"><svg fill="none" height={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 3h16v4h-2V5H5v14h14v-2h2v4H3V3h2zm16 8h-2V9h-2V7h-2v2h2v2H7v2h10v2h-2v2h2v-2h2v-2h2v-2z" fill="currentColor"/> </svg></div>
                                </label>
                            </button> :
                            <button onClick={() => document.getElementById("sign-in")?.click()} className="flex flex-row justify-between items-center p-4 border group border-green-500 text-green-500 w-full hover:cursor-pointer hover:text-base-200 hover:bg-green-500 transition-colors">
                                <p>Sign in</p>
                                <label className="swap group-hover:swap-active text-6xl">
                                    <div className="swap-on"><svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M10 2h4v4h-4V2zM7 7h10v2h-2v13h-2v-6h-2v6H9V9H7V7zM5 5v2h2V5H5zm0 0H3V3h2v2zm14 0v2h-2V5h2zm0 0V3h2v2h-2z" fill="currentColor"/> </svg></div>
                                    <div className="swap-off"><svg fill="none" height={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 3H3v4h2V5h14v14H5v-2H3v4h18V3H5zm12 8h-2V9h-2V7h-2v2h2v2H3v2h10v2h-2v2h2v-2h2v-2h2v-2z" fill="currentColor"/> </svg></div>
                                </label>
                            </button>
                        }
                    </div>
                    <div className="lg:col-start-4 lg:col-span-12 lg:grid hidden col-span-1 lg:h-full h-[0px] grid-cols-1 lg:gap-10 lg:pt-4 lg:px-4 overflow-x-auto">
                        {servers.filter((s: MCStatus) => s.online)?.map((route: MCStatus, i: number) => {
                        const server = route as JavaStatusResponse;
                        return (
                            <div key={i} className="card rounded-none bg-base-200 w-full h-1/6 flex flex-row">
                                <div className="ml-4 h-[64px] self-center">
                                    <Image className="bg-base-200" width={64} height={64} alt={server.host} src={server.icon ?? '/images/server-icon.webp'}/>
                                </div>
                                <div className="card-body flex flex-row gap-10">
                                    <p dangerouslySetInnerHTML={{__html: (server && server.motd ? server.motd.html.replace("\n", "<br />") : "Unknown")}}/>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-xs text-slate-400">Version: <span dangerouslySetInnerHTML={{__html: (server && server.version ? server.version.name_html : "Unknown")}}/></p>
                                        {server.players && server.players.list && server.players.list.length > 0 && <p className="text-xs text-slate-400">Players: {server.players.list.map((player: { uuid: string; name_raw: string; name_html: string; name_clean: string}, i: number) => {
                                            return <span key={i} dangerouslySetInnerHTML={{__html: player.name_html}}/>;
                                        })}</p>}
                                        <label className="input-group">
                                            <p className="bg-neutral py-2 px-4 gap-2 flex text-slate-400 tooltip tooltip-right hover:text-slate-200 hover:cursor-pointer justify-between" data-tip="Copy" onClick={(e) => copyIP(e, server.host)}>{server.host}<svg height={24} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M4 2h11v2H6v13H4V2zm4 4h12v16H8V6zm2 2v12h8V8h-8z" fill="currentColor"/> </svg></p>
                                        </label>
                                    </div>
                                    <div className={`flex justify-center items-center font-black${server.players && server.players.online > 0 ? ' text-green-500': ' text-red-500'}`}>
                                        <p>{server.players && `${server.players.online}/${server.players.max}`}</p>
                                    </div>
                                </div>
                            </div>
                        )
                        })}
                    </div>
                </div>

                {sessionData?.user ? <>
                    <DeleteModal route={deleteRoute} />
                    <AddModal />
                </> : <SignInModal />}
            </main>
        </>
    )
}

export default Home;