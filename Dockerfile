# define this stage as 'build'
FROM node:20 AS build

ARG VITE_BACKEND_URL=http://localhost:3001/api/v1

WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .

# create static build
RUN npm run build

# define final stage as 'final' based on the 'nginx' image
FROM nginx AS final

# set working directory to folder that nginx serves files from
WORKDIR /usr/share/nginx/html

# from our 'build' stage, copy everything in the /build/dist folder, which is where our vite build is
COPY --from=build /build/dist .