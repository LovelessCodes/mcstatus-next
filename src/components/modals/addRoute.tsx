import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { z } from 'zod';
import { api } from '~/utils/api';

const AddRoute = () => {
    const { data: sessionData } = useSession();
    const [ address, setAddress ] = useState("");
    const [ backend, setBackend ] = useState("");
    const utils = api.useUtils();

    const url = z.string().regex(/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/);
    const back = z.string().regex(/[-a-zA-Z0-9]+:[0-9]{1,5}/)

    const { mutate: addNewRoute, isLoading: isInserting } = api.route.insertRoute.useMutation({
        onSuccess: async () => {
            document.getElementById("Add-route")?.click();
            setAddress("");
            setBackend("");
            await utils.route.routes.invalidate();
        },
    });
    if (sessionData === undefined) return <div>Loading...</div>;
    return (
        <>
            <input type="checkbox" id="add-route" className="modal-toggle peer"/>
            <label htmlFor="add-route" className="modal peer-checked:grid hidden">
                <label className="modal-box rounded-none relative" htmlFor="">
                    <div className="flex flex-col p-10">
                        <label htmlFor="add-route" className="absolute top-2 right-2 border-red-900 text-red-500 hover:text-base-200 hover:bg-red-500 transition-colors border rounded-none cursor-pointer">
                            <svg fill="none" height={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z" fill="currentColor"/> </svg>
                        </label>
                        <h2 className="text-2xl font-bold">Add Server</h2>
                        <div className="form-control">
                            <div className="tooltip" data-tip="You need to own the domain, and have the domain or subdomain pointed at the server running the router.">
                                <label className="flex flex-col text-left">
                                    <span className="label-text">Address *</span>
                                    <span className="label-description text-xs italic opacity-75">
                                        The address you want the server to be accessible on.
                                    </span>
                                </label>
                            </div>
                            <input type="text" minLength={1} placeholder="mc.test.com" className={`input ${(!url.safeParse(address).success || address.length === 0) && "border-pink-600"} input-bordered rounded-none`} value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <p className={`mt-2 ${!url.safeParse(address).success && address.length > 0 ? "visible" : "invisible"} text-pink-600 text-sm`}>
                            Please provide a valid address.
                        </p>
                        <div className="form-control">
                            <div className="tooltip" data-tip="Alternatively use the ip-address of the docker container + the port exposed to the server.">
                                <label className="flex flex-col text-left">
                                    <span className="label-text">Backend *</span>
                                    <span className="label-description text-xs italic opacity-75">
                                        The docker container&apos;s name + the port exposed to the server.
                                    </span>
                                </label>
                            </div>
                            <input type="text" minLength={1} placeholder="docker_container:25565" className={`input ${(!back.safeParse(backend).success || backend.length === 0) && "border-pink-600"} input-bordered rounded-none`} value={backend} onChange={(e) => setBackend(e.target.value)} />
                        </div>
                        <p className={`mt-2 ${!back.safeParse(backend).success && backend.length > 0 ? "visible" : "invisible"} text-pink-600 text-sm`}>
                            Please provide a valid backend.
                        </p>
                        <div className="form-control mt-6">
                            {isInserting ?
                                <button className="btn btn-primary rounded-none btn-disabled">Creating...</button> :
                                <button
                                    disabled={!url.safeParse(address).success || !back.safeParse(backend).success || address.length === 0 || backend.length === 0}
                                    className="btn btn-primary rounded-none"
                                    onClick={() => url.safeParse(address).success && back.safeParse(backend).success && addNewRoute({ address, backend })}
                                >Add</button>
                            }
                            <label className="btn btn-ghost rounded-none w-1/2" htmlFor="add-server">Cancel</label>
                        </div>
                    </div>
                </label>
            </label>
        </>
    )
}

export default AddRoute;