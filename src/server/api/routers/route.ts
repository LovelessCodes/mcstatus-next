import { z } from "zod";
import axios from "axios";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { statusJava } from "node-mcstatus";

export const routeRouter = createTRPCRouter({
  routes: publicProcedure.query(async () => {
    const { data } = await axios.get(
      env.MCROUTER_API_URL + "/routes",
      {
        headers: {
          "Accept": "application/json",
        }
      }
    )
    let servers = [];
    for(const route of Object.keys(data)) {
      const server = await statusJava(route);
      servers.push(server);
    }
    return servers;
  }),
  privRoutes: protectedProcedure.query(async () => {
    const { data } = await axios.get(
      env.MCROUTER_API_URL + "/routes",
      {
        headers: {
          "Accept": "application/json",
        }
      }
    )
    let routes = [];
    for(const route of Object.keys(data)) {
      routes.push({ address: route, backend: data[route] });
    }
    return routes;
  }),
  insertRoute: protectedProcedure.input(z.object({ address: z.string(), backend: z.string() })).mutation(async ({ input }) => {
    const { data } = await axios.post(
      env.MCROUTER_API_URL + "/routes",
      {
        serverAddress: input.address,
        backend: input.backend,
      },
      {
        headers: {
          "Accept": "application/json",
        }
      }
    )
    return data;
  }),
  updateRoute: protectedProcedure.input(z.object({ address: z.string(), backend: z.string() })).mutation(async ({ input }) => {
    await axios.delete(
      env.MCROUTER_API_URL + "/routes/" + input.address
    )
    const { data } = await axios.post(
      env.MCROUTER_API_URL + "/routes",
      {
        serverAddress: input.address,
        backend: input.backend,
      },
      {
        headers: {
          "Accept": "application/json",
        }
      }
    )
    return data;
  }),
  deleteRoute: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    const { data } = await axios.delete(
      env.MCROUTER_API_URL + "/routes/" + input
    )
    return data;
  }),
});
