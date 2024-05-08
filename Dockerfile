# Use the official Node.js image as the base image
FROM oven/bun:1 as base

# Set the working directory inside the container
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# [optional] tests & build
ENV NODE_ENV=production
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/index.ts .
COPY --from=prerelease /usr/src/app/package.json .

USER bun

# Expose the port that the application will be listening on
EXPOSE 3000/tcp

# Run the application
ENTRYPOINT [ "bun", "run", "index.ts" ]