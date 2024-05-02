import { z } from "zod";
import {statusJava, statusBedrock} from "node-mcstatus";

import {
  createTRPCRouter,
  publicProcedure
} from "~/server/api/trpc";

export const statusRouter = createTRPCRouter({
  status: publicProcedure.input(z.object({ address: z.string(), type: z.enum(["java", "bedrock"]) })).mutation(async ({ input }) => {
    let status;
    if (input.type == "java") {
      status = await statusJava(input.address, 25565, { query: true });
    } else if (input.type == "bedrock") {
      status = await statusBedrock(input.address);
    }
    return status;
  }),
  statuses: publicProcedure.input(z.object({ addresses: z.array(z.string()), type: z.enum(["java", "bedrock"]) })).query(async ({ input }) => {
    const statuses = [];
    for (const address of input.addresses) {
      let status;
      if (input.type == "java") {
        status = await statusJava(address, 25565, { query: true });
      } else if (input.type == "bedrock") {
        status = await statusBedrock(address);
      }
      statuses.push(status);
    }
    return statuses;
  }),
});
