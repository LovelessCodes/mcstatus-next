import { z } from 'zod'
import { env } from '~/env.mjs'

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from '~/server/api/trpc'

export const routeRouter = createTRPCRouter({
    routes: publicProcedure.query(async () => {
        const response: Response = await fetch(
            env.MCROUTER_API_URL + '/routes',
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            },
        )
        const data: [key: string] = (await response.json()) as [key: string]
        return Object.keys(data).map((address: string) => ({ address })) as {
            address: string
        }[]
    }),
    privRoutes: protectedProcedure.query(async () => {
        const response: Response = await fetch(
            env.MCROUTER_API_URL + '/routes',
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            },
        )
        const { data }: { data: Record<string, string> } =
            (await response.json()) as { data: Record<string, string> }
        return Object.keys(data).map((address: string) => ({
            address,
            backend: data[address],
        })) as { address: string; backend: string }[]
    }),
    insertRoute: protectedProcedure
        .input(z.object({ address: z.string(), backend: z.string() }))
        .mutation(async ({ input }) => {
            const response: Response = await fetch(
                env.MCROUTER_API_URL + '/routes',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        serverAddress: input.address,
                        backend: input.backend,
                    }),
                },
            )
            return response.ok
        }),
    updateRoute: protectedProcedure
        .input(z.object({ address: z.string(), backend: z.string() }))
        .mutation(async ({ input }) => {
            await fetch(env.MCROUTER_API_URL + '/routes/' + input.address, {
                method: 'DELETE',
            })
            const response: Response = await fetch(
                env.MCROUTER_API_URL + '/routes',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        serverAddress: input.address,
                        backend: input.backend,
                    }),
                },
            )
            return response.ok
        }),
    deleteRoute: protectedProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
            const response: Response = await fetch(
                env.MCROUTER_API_URL + '/routes/' + input,
                {
                    method: 'DELETE',
                },
            )
            return response.ok
        }),
})
