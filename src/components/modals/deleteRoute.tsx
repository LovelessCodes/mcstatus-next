import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";

const DeleteRoute = ({route}: {route: string}) => {
    const { data: sessionData } = useSession();
    const utils = api.useContext();
  
    const { mutate: deleteRoute, isLoading: isDeleting } = api.route.deleteRoute.useMutation({
      onSuccess: () => {
        document.getElementById("delete-route")?.click();
        console.log("Success");
        utils.route.routes.invalidate();
      },
      onError: () => {
        console.log("Error");
      },
    });
    if (sessionData === undefined) return <div>Loading...</div>;
    return (
        <>
            <input type="checkbox" id="delete-route" className="modal-toggle"/>
            <label htmlFor="delete-route" className="modal">
                <label className="modal-box relative" htmlFor="">
                    <div className="flex flex-col p-10">
                        <label htmlFor="delete-route" className="absolute top-2 right-2 btn btn-sm btn-circle cursor-pointer">X</label>
                        <h2 className="text-2xl font-bold">Confirm Deletion</h2>
                        <p className="text-lg">Are you sure you want to delete this route?</p>
                        <label className="input-group w-full">
                            <span>Route</span>
                            <p className="bg-neutral py-2 w-9/12 px-4 flex text-slate-400 tooltip tooltip-right hover:text-slate-200 hover:cursor-pointer justify-between" data-tip="Copy IP" onClick={(e) => {
                            navigator.clipboard.writeText(route);
                            const target = e.currentTarget;
                            target.classList.toggle("tooltip-success");
                            target.setAttribute("data-tip", "Copied");
                            setTimeout(() => {
                                target.classList.toggle("tooltip-success");
                                target.setAttribute("data-tip", "Copy IP");
                            }, 1000);
                            }}>{route}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 22q-.825 0-1.413-.588T3 20V6h2v14h11v2H5Zm4-4q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Zm0-2h9V4H9v12Zm0 0V4v12Z"/></svg></p>
                        </label>
                        <div className="btn-group w-full mt-6">
                            {isDeleting ?
                                <button className="btn btn-primary w-1/2" disabled>Deleting...</button> :
                                <button className="btn btn-error w-1/2" onClick={() => {
                                    deleteRoute(route);
                                }}>Confirm</button>
                            }
                            <label className="btn btn-ghost w-1/2" htmlFor="delete-route">Cancel</label>
                        </div>
                    </div>
                </label>
            </label>
        </>
    )
}

export default DeleteRoute;