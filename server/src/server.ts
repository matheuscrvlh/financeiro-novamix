import 'dotenv/config';
import fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { dataRoutes } from './routes/data.routes';

const app = fastify();

await app.register(cors, {
    origin: ['https://hub.lojanovamix.com.br'],
    credentials: true
});

if(!process.env.SERVER_PORT) {
    throw new Error('Erro ao encontrar SERVER_PORT no .env.')
} else if (!process.env.JWT_SECRET) {
    throw new Error('Erro ao encontrar JWT_SECRET no .env.')
};

app.register(cookie);
app.register(dataRoutes);

app.listen({ host: '0.0.0.0', port: process.env.SERVER_PORT},
    console.log(`Servidor rodando em ${process.env.SERVER_PORT}`)
)