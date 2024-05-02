import { z } from "zod";
import { pingJava, pingBedrock } from "@minescope/mineping";

import {
  createTRPCRouter,
  publicProcedure
} from "~/server/api/trpc";

export const statusRouter = createTRPCRouter({
  status: publicProcedure.input(z.object({ address: z.string(), type: z.enum(["java", "bedrock"]) })).mutation(async ({ input }) => {
    let status;
    if (input.type == "java") {
      status = await pingJava(input.address);
    } else if (input.type == "bedrock") {
      status = await pingBedrock(input.address);
    }
    return status;
  }),
  statuses: publicProcedure.input(z.object({ addresses: z.array(z.string()), type: z.enum(["java", "bedrock"]) })).query(async ({ input }) => {
    const statuses = [];
    for (const address of input.addresses) {
      let status;
      if (input.type == "java") {
        status = await pingJava(address);
      } else if (input.type == "bedrock") {
        status = await pingBedrock(address);
      }
      statuses.push(status);
    }
    return statuses;
  }),
});
