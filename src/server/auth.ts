import { type GetServerSidePropsContext } from 'next'
import {
    getServerSession,
    type NextAuthOptions,
    type DefaultSession,
} from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import GitHubProvider from 'next-auth/providers/github'
import { env } from '~/env.mjs'

const Providers = []

if (env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) {
    Providers.push(
        DiscordProvider({
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        }),
    )
}
if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    Providers.push(
        GitHubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }),
    )
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string
            // ...other properties
            // role: UserRole;
        } & DefaultSession['user']
    }

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    callbacks: {
        signIn({ user }) {
            if (!user.email) {
                return false
            }
            if (!env.AUTHENTICATED_EMAILS) {
                return false
            }
            if (!env.AUTHENTICATED_EMAILS.includes(user.email)) {
                return false
            }
            return true
        },
        session: ({ session }) => ({
            ...session,
            user: {
                ...session.user,
            },
        }),
    },
    providers: Providers,
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext['req']
    res: GetServerSidePropsContext['res']
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions)
}
