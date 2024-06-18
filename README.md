# ShelfDiver-API
Back-end API for the more global Shelfdiver project, which acts as the bridge between database and front-end. Built with NestJS.

## Prerequisites

* Please make sure that Node.js (version >= 16) is installed on your operating system.
* You should have the NestJS CLI globally installed. Open up a terminal and run `npm i -g @nestjs/cli`.
* This project uses a MySQL Database. I recommend having the latest version of it. If you don't have any MySQL Server installed, you can either follow the link below or choose your own server.

#### Source link to install Node.js : https://nodejs.org/en/learn/getting-started/how-to-install-nodejs
#### Source link to install MySQL : https://dev.mysql.com/downloads/installer/

## Libraries

This project uses some libraries, listed as below:
* TypeOrm
* bcrypt
* class-transformer
* class-validator
* mysql12
* passport

## Installation & Running

- Clone the repository on your local machine.
- Open the repository in your usual IDE.
- Follow the `.env.example` file to fill in the environment variables accordingly into a `.env` file that you must have created on the folder's root.
- Open up a terminal and run `npm install`.
- When the dependencies are installed, run `npm run build` and then `npm run start` if you are in production mode or simply `npm run start:dev` if you are in dev mode.
