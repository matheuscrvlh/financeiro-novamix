import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify"

async function login(req:FastifyRequest, res:FastifyReply) {
    const authHeader = req.headers['authorization']
    const token = req.cookies.user ?? authHeader?.split('')[1];
    
    if(!token) {
        res.code(404).send({ error: 'Nenhum token encontrado.'})
    }

    res
}

export function authRoutes(fastify: FastifyInstance) {
    fastify.post('/login', login)
}