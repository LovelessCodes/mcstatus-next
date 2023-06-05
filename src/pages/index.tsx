import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useState } from "react";
import Image from "next/image";
import CreateRoute from "~/components/modals/createRoute";
import DeleteRoute from "~/components/modals/deleteRoute";

const Home: NextPage = () => {
  const utils = api.useContext();
  const { data: sessionData } = useSession();
  const [ deleteRoute, setDeleteRoute ] = useState("");
  const {data: routes, isInitialLoading: isRoutesLoading, isFetching: isRoutesFetching} = api.route.routes.useQuery(undefined, { enabled: true });
  const {data: privRoutes} = api.route.privRoutes.useQuery(undefined, { enabled: sessionData?.user != undefined });
  if (isRoutesLoading || routes === undefined) return (
    <>
      <Head>
        <title>MCStatus</title>
        <meta name="description" content="MCStatus"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen justify-center flex flex-col items-center">
        <div className="stats bg-gradient-to-br from-primary to-base-100 text-primary-content">
          <div className="stat animate-pulse">
            <div className="stat-title text-slate-200">Active Servers</div>
            <div className="stat-value h-10 w-full"></div>
          </div>
          <div className="stat animate-pulse">
            <div className="stat-title text-slate-200">Total Routes</div>
            <div className="stat-value h-10 w-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 my-12 gap-10 sm:w-full md:w-9/12 h-1/6">
          <div className="card shadow-lg indicator bg-gradient-to-b from-base-200 to-base-100 w-full flex justify-center items-center opacity-25 animate-pulse">
          </div>
          <div className="card shadow-lg indicator bg-gradient-to-b from-base-200 to-base-100 w-full flex justify-center items-center opacity-25 animate-pulse">
          </div>
        </div>
      </main>
    </>
  );
  return (
    <>
      <Head>
        <title>MCStatus</title>
        <meta name="description" content="MCStatus"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen justify-center flex flex-col items-center">
        <div className="stats bg-gradient-to-br from-primary to-base-100 text-primary-content">
          <div className="stat">
            <div className="stat-title text-slate-200">Active Servers</div>
            <div className="stat-value">{routes.filter(s => s.online).length}</div>
          </div>
          <div className="stat">
            <div className="stat-title text-slate-200">Total Routes</div>
            <div className="stat-value">{routes?.length}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 my-12 gap-10 sm:w-full md:w-9/12">
          {routes?.map((route, i) => {
            let privRoute = privRoutes?.find(r => r.address == route.host);
            return (
              <div key={i} className="card shadow-lg indicator bg-gradient-to-b from-base-200 to-base-100 w-full">
                <div className={`indicator-item badge text-base-100 font-black${route.online ? ' badge-success': ' badge-error'}`}>{route.players && `${route.players.online}/${route.players.max}`}</div>
                <Image className="absolute -top-9 left-1/2 -translate-x-1/2 bg-base-200 mask mask-squircle" width={64} height={64} alt={route.host} src={route.icon ? route.icon : '/images/server-icon.webp'}/>
                <div className="card-body">
                  <p dangerouslySetInnerHTML={{__html: (route && route.motd ? route.motd.html.replace("\n", "<br />") : "Unknown")}}/>
                  <p className="text-xs text-slate-400">Version: <span dangerouslySetInnerHTML={{__html: (route && route.version ? route.version.name_html : "Unknown")}}/></p>
                  {route.players && route.players.list && route.players.list.length > 0 && <p className="text-xs text-slate-400">Players: {route.players.list.map((player, i) => {
                    return <span key={i} dangerouslySetInnerHTML={{__html: player.name_html}}/>;
                  })}</p>}
                  <label className="input-group">
                    <span>IP</span>
                    <p className="bg-neutral py-2 px-4 flex text-slate-400 tooltip tooltip-right hover:text-slate-200 hover:cursor-pointer justify-between" data-tip="Copy" onClick={(e) => {
                      navigator.clipboard.writeText(route.host);
                      const target = e.currentTarget;
                      target.classList.toggle("tooltip-success");
                      target.setAttribute("data-tip", "Copied");
                      setTimeout(() => {
                        target.classList.toggle("tooltip-success");
                        target.setAttribute("data-tip", "Copy");
                      }, 1000);
                    }}>{route.host}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 22q-.825 0-1.413-.588T3 20V6h2v14h11v2H5Zm4-4q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Zm0-2h9V4H9v12Zm0 0V4v12Z"/></svg></p>
                  </label>
                  {sessionData?.user && privRoute &&
                    <p className="bg-neutral rounded-lg opacity-25 hover:opacity-75 py-2 px-4 flex text-slate-400 tooltip tooltip-right hover:text-slate-200 hover:cursor-pointer justify-between" data-tip="Copy" onClick={(e) => {
                      if (privRoute == undefined) return;
                      navigator.clipboard.writeText(privRoute.backend);
                      const target = e.currentTarget;
                      target.classList.toggle("tooltip-success");
                      target.setAttribute("data-tip", "Copied");
                      setTimeout(() => {
                        target.classList.toggle("tooltip-success");
                        target.setAttribute("data-tip", "Copy");
                      }, 1000);
                    }}>{privRoute.backend}</p>
                  }
                  {sessionData &&
                    <div className="card-actions justify-center">
                      <button className="btn btn-primary">Edit</button>
                      <button className="btn btn-ghost" onClick={
                        () => {
                          setDeleteRoute(route.host);
                          document.getElementById("delete-route")?.click();
                        }
                      }>Delete</button>
                    </div>
                  }
                </div>
              </div>
            )
          })}
          {
            sessionData && <>
              {isRoutesFetching ?
                <div className="card shadow-lg indicator bg-gradient-to-b from-base-200 to-base-100 w-full flex justify-center items-center opacity-25 animate-pulse">
                </div>
                :
                <label htmlFor="create-route" className="card shadow-lg indicator bg-gradient-to-b from-base-200 to-base-100 w-full flex justify-center items-center opacity-25 hover:opacity-75 hover:cursor-pointer transition-opacity">
                  <span className="text-8xl font-black"><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M4 3.5h8a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm6 7a.75.75 0 0 1-.75-.75v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5a.75.75 0 0 1 1.5 0v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5A.75.75 0 0 1 8 11Z" clip-rule="evenodd"/></svg></span>
                </label>
              }
            </>
          }
        </div>
      </main>
      <DeleteRoute route={deleteRoute} />
      <CreateRoute />
    </>
  );
};

export default Home;
