FROM node:19.8.1-alpine3.17@sha256:31f511a1df6629e0853968af162a1ea55a80fe07d35a1d1c96a5bca736823097

# Set shell to ash
ENV SHELL /bin/ash

RUN apk add git openssh ca-certificates just

# Install PNPM
RUN npm install -g pnpm
