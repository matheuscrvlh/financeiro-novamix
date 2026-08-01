import type { FastifyRequest, FastifyReply } from "fastify"
import { verifyToken } from "../utils/jwt";

declare module 'fastify' {
    interface FastifyRequest {
        user: any
    }
}

export async function authenticate(req:FastifyRequest, res:FastifyReply) {
    const authHeader = req.headers['authorization'];
    const token = req.cookies.user ?? authHeader?.split(' ')[1];
    
    if(!token) {
        res.code(401).send({ error: 'Autorização não encontrada.'})
        return
    }

    req.user = await verifyToken(token, res)
}

export async function checkPermission(req:FastifyRequest, res:FastifyReply) {
    const { permissions } = req.user
    
    const module = permissions.some(p => p.module === 'financeiro')

    if(!module) {
        res.code(401).send({ error: 'Módulo não liberado para esse usuário.'})
        return
    }

    const permission = permissions.find(p => p.module === 'financeiro').access
    
    return permission
}

export async function checkBranch(req:FastifyRequest, res:FastifyReply) {
    const { branchs } = req.user

    const branch = branchs.map(b => b.id)

    if(branch.length === 0) {
        res.code(401).send({ error: 'Filial para este usuário não encontrada'})
        return
    }

    return branch
}