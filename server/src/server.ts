import 'dotenv/config';
import fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { authRoutes } from './routes/auth.routes';

const app = fastify();

await app.register(cors, {
    origin: '*'
});

if(!process.env.SERVER_PORT) {
    throw new Error('Erro ao encontrar SERVER_PORT no .env.')
};

app.register(cookie);
app.register(authRoutes);

app.listen({ host: '0.0.0.0', port: process.env.SERVER_PORT},
    console.log(`Servidor rodando em ${process.env.SERVER_PORT}`)
)