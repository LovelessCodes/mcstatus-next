# MCStatus-Next
![TypeScript Badge](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NextJS Badge](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind Badge](https://img.shields.io/badge/tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![DaisyUI Badge](https://img.shields.io/badge/daisyui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)   
MCStatus-Next is a project built with Next.js, tRPC, NextAuth, and integration with the MCRouter API through environment variables. It provides a powerful and user-friendly dashboard to monitor the status of Minecraft servers served through MCRouter.    

## Demo
[![Demo Badge](https://img.shields.io/badge/demo_hosted_on-vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mcstatus-next.vercel.app/)

## Features
🔍 **Server Status Monitoring**: MCStatus-Next allows you to monitor the status of your Minecraft servers in real-time. It provides information on the server's uptime, player count, and other important metrics.

🔒 **Third-party Authentication**: The project integrates with Discord and Github authentication through Next Auth, allowing users to sign in securely using their Discord or Github accounts. This ensures a seamless and convenient login experience for server administrators.

🔌 **MCRouter API Integration**: MCStatus-Next connects with the MCRouter API, enabling it to retrieve essential information about the Minecraft servers. It utilizes environment variables to configure the API URL, ensuring flexibility and ease of use.

🖥️ **User-Friendly Dashboard**: The dashboard interface is designed to be intuitive and user-friendly. It provides an organized view of server status, player activity, and other relevant data, making it easy to manage multiple Minecraft servers effectively.

### Development
- [x] User authentication
- [x] MC-Router API implementation
- [x] Server Status fetching
- [x] Add new server(s)
- [x] Delete server(s)
- [ ] Edit/Update server(s)
- [ ] Set a default server
- [ ] More authentication options

## Setup
To set up MCStatus-Next, follow the steps below:

### Local
1. Clone the repository to your local machine.
2. Create a `.env.local` file based on the provided `.env.example` file.
3. Fill in the necessary configuration values in the `.env.local` file, including the Discord client ID and secret, MCRouter API URL, and any other required variables.
4. Install the project dependencies by running `npm install` or `yarn install` in the project's root directory.
5. Start the development server with `npm run dev` or `yarn dev`.

MCStatus-Next will now be accessible in your web browser at the specified URL.

### Docker
`docker run -d -p 6969:6969 ghcr.io/lovelesscodes/mcstatus-next:latest`
Using `docker-compose`
```yml
services:
  mcstatus-next:
    container_name: mcstatus-next
    image: ghcr.io/lovelesscodes/mcstatus-next:latest
    restart: always
    ports:
      - 6969:6969
```
No environment variables are required to run the service, but the defaults will be used.   
Environment Variables
| Variable  | Default | 
| ------------- | ------------- |
| NEXTAUTH_SECRET  | `secret` |
| NEXTAUTH_URL     | `http://localhost:6969`  |
| DISCORD_CLIENT_ID | `undefined` |
| DISCORD_CLIENT_SECRET | `undefined` |
| GITHUB_CLIENT_ID | `undefined` |
| GITHUB_CLIENT_SECRET | `undefined` |
| MCROUTER_API_URL | `https://router.less.cx` |
| AUTHENTICATED_EMAILS | `undefined` |
| PAGE_TITLE | `undefined` |
| PAGE_DESCRIPTION | `undefined` |
| FAVICON_URL | `undefined` |

## Contributing
Contributions to MCStatus-Next are welcome! If you encounter any issues or have suggestions for improvements, feel free to open an issue or submit a pull request on the project's GitHub repository.

## License
MCStatus-Next is licensed under the [MIT License](LICENSE.md). You are free to modify and distribute this project in accordance with the terms of the license.

## Acknowledgments
MCStatus-Next was inspired by the need for a comprehensive and user-friendly solution to monitor Minecraft server status. Special thanks to the creators and contributors of [Next.js](https://github.com/vercel/next.js), [tRPC](https://github.com/trpc/trpc), [NextAuth](https://github.com/nextauthjs/next-auth), and [MCRouter](https://github.com/itzg/mc-router) for their amazing work.