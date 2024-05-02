import { useSession } from 'next-auth/react'
import { api } from '~/utils/api'
import { copyIP } from '~/utils/helpers'

const DeleteRoute = ({ route }: { route: string }) => {
    const { data: sessionData } = useSession()
    const utils = api.useUtils()

    const { mutate: deleteRoute, isLoading: isDeleting } =
        api.route.deleteRoute.useMutation({
            onSuccess: async () => {
                document.getElementById('delete-route')?.click()
                await utils.route.routes.invalidate()
            },
        })

    if (sessionData === undefined) return null
    return (
        <>
            <input
                type="checkbox"
                id="delete-route"
                className="modal-toggle peer"
            />
            <label
                htmlFor="delete-route"
                className="modal peer-checked:grid hidden"
            >
                <label className="modal-box rounded-none relative" htmlFor="">
                    <div className="flex flex-col p-10">
                        <label
                            htmlFor="delete-route"
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
                        <h2 className="text-2xl font-bold">Confirm Deletion</h2>
                        <p className="text-lg">
                            Are you sure you want to delete this server?
                        </p>
                        <label className="input-group w-full mt-4">
                            <span>Server</span>
                            <p
                                className="bg-neutral py-2 w-9/12 px-4 flex text-slate-400 tooltip tooltip-right hover:text-slate-200 hover:cursor-pointer justify-between"
                                data-tip="Copy IP"
                                onClick={(e) => copyIP(e, route)}
                                onKeyUp={(e) =>
                                    e.key === 'Enter' && copyIP(e, route)
                                }
                            >
                                {route}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M5 22q-.825 0-1.413-.588T3 20V6h2v14h11v2H5Zm4-4q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Zm0-2h9V4H9v12Zm0 0V4v12Z"
                                    />
                                </svg>
                            </p>
                        </label>
                        <div className="btn-group w-full mt-6">
                            {isDeleting ? (
                                <button
                                    type="button"
                                    className="btn btn-primary rounded-none w-1/2"
                                    disabled
                                >
                                    Deleting...
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-error rounded-none w-1/2"
                                    onClick={() => {
                                        deleteRoute(route)
                                    }}
                                >
                                    Confirm
                                </button>
                            )}
                            <label
                                className="btn btn-ghost rounded-none w-1/2"
                                htmlFor="delete-route"
                            >
                                Cancel
                            </label>
                        </div>
                    </div>
                </label>
            </label>
        </>
    )
}

export default DeleteRoute
