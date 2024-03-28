import express from "express";
import { Express, Request, Response } from 'express'
import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { Insurance, IDL } from './type-file/insurance'
import cors from 'cors'
import { addEventListener } from './src/listener'
import { connectToDatabase } from './src/database'
import findConfig from 'find-config'
import dotenv from 'dotenv'

let path : string = findConfig('.env')!
dotenv.config({ path: path })

const app: Express = express()
const port = process.env.PORT

app.use(express.json())
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3002',
            'https://defi-os.com',
            'https://www.defi-os.com',
        ],
    })
)

const { web3 } = anchor

const PROGRAM_ID = new web3.PublicKey(process.env.INSURANCE_PROGRAM_ID as string)


anchor.setProvider(anchor.AnchorProvider.env())
const program = new anchor.Program(IDL, PROGRAM_ID) as Program<Insurance>
const {
    provider: { connection },
} = program

app.get('/', async (req: Request, res: Response) => {
    res.send('Express + TypeScript Server')
})

app.listen(port, async () => {
    await connectToDatabase()
    addEventListener(program)
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})