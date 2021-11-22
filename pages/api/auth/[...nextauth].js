import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GithubProvider from "next-auth/providers/github"

const prisma = new PrismaClient();

export default NextAuth({  
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({ 
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET, 
            scope: "read:user"  
        }),   
     ],
    database: process.env.DATABASE_URL,
    secret: process.env.SECRET,
    callbacks: {
    },
    debug: true,
    });