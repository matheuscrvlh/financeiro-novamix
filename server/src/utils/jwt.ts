import type { FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export async function verifyToken(token: string, res:FastifyReply) {
    try {
        const verifyPayload = jwt.verify(token, process.env.JWT_SECRET)

        if(!verifyPayload) {
            res.code(401).send({ error: 'Erro ao verificar token.'})
            return
        }

        console.log(verifyPayload)
        return verifyPayload
    } catch(error) {
        res.code(401).send({ error: 'Erro ao verificar payload.'})
    }
    
};