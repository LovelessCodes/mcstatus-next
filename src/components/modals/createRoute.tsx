import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";

const CreateRoute: React.FC = () => {
    const { data: sessionData } = useSession();
    const [ address, setAddress ] = useState("");
    const [ backend, setBackend ] = useState("");
    const utils = api.useContext();
  
    const { mutate: addNewRoute, isLoading: isInserting } = api.route.insertRoute.useMutation({
      onSuccess: () => {
        document.getElementById("create-route")?.click();
        setAddress("");
        setBackend("");
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
            <input type="checkbox" id="create-route" className="modal-toggle"/>
            <label htmlFor="create-route" className="modal">
                <label className="modal-box relative" htmlFor="">
                    <div className="flex flex-col p-10">
                        <label htmlFor="create-route" className="absolute top-2 right-2 btn btn-sm btn-circle cursor-pointer">X</label>
                        <h2 className="text-2xl font-bold">Create Route</h2>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Address</span>
                            </label>
                            <input type="text" placeholder="Address" className="input input-bordered" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Backend</span>
                            </label>
                            <input type="text" placeholder="Backend" className="input input-bordered" value={backend} onChange={(e) => setBackend(e.target.value)} />
                        </div>
                        <div className="form-control mt-6">
                            {isInserting ?
                                <button className="btn btn-primary btn-disabled">Creating...</button> :
                                <button className="btn btn-primary" onClick={() => addNewRoute({ address, backend })}>Create</button>
                            }
                        </div>
                    </div>
                </label>
            </label>
        </>
    )
}

export default CreateRoute;