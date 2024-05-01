import { z } from "zod";
import axios from "axios";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const routeRouter = createTRPCRouter({
  routes: publicProcedure.query(async () => {
    const response = await fetch(
      env.MCROUTER_API_URL + "/routes",
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
        }
      }
    )
    const { data }: { data: Record<string, string> } = await response.json();
    return Object.keys(data).map((address: string) => ({ address })) as { address: string }[];
  }),
  privRoutes: protectedProcedure.query(async () => {
    const response = await fetch(
      env.MCROUTER_API_URL + "/routes",
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
        }
      }
    )
    const { data }: { data: Record<string, string> } = await response.json();
    return Object.keys(data).map((address: string) => ({ address, backend: data[address] })) as { address: string, backend: string }[];
  }),
  insertRoute: protectedProcedure.input(z.object({ address: z.string(), backend: z.string() })).mutation(async ({ input }) => {
    const response = await fetch(
      env.MCROUTER_API_URL + "/routes",
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: JSON.stringify({
          serverAddress: input.address,
          backend: input.backend,
        }),
      }
    )
    const { data }: { data: string } = await response.json();
    return data as string;
  }),
  updateRoute: protectedProcedure.input(z.object({ address: z.string(), backend: z.string() })).mutation(async ({ input }) => {
    await axios.delete(
      env.MCROUTER_API_URL + "/routes/" + input.address
    )
    const response = await fetch(
      env.MCROUTER_API_URL + "/routes",
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: JSON.stringify({
          serverAddress: input.address,
          backend: input.backend,
        })
      }
    )
    const { data }: { data: string } = await response.json();
    return data as string;
  }),
  deleteRoute: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    const response = await fetch(
      env.MCROUTER_API_URL + "/routes/" + input,
      {
        method: "DELETE",
      }
    )
    const { data }: { data: string } = await response.json();
    return data as string;
  }),
});
