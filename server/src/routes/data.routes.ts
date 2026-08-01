import { authenticate, checkBranch, checkPermission } from "../middlewares/auth.middlewares"

async function teste(req, res) {
    res.send({message: 'teste ok'})
}

async function teste2(req, res) {
    res.send({message: 'teste ok'})
}

export function dataRoutes(fastify) {
    fastify.post('/teste', { preHandler: [ authenticate, checkPermission, checkBranch ] }, teste)
    fastify.post('/teste2', teste2)
}