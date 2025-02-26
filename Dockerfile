# Usando Node.js como base
FROM node:20-alpine

WORKDIR /app

# Copiar apenas arquivos essenciais primeiro para otimizar cache
COPY package.json package-lock.json ./

# Rodar npm install dentro do container
RUN npm install

# Copiar restante do código
COPY . .

# Expor porta do servidor
EXPOSE 5000

# Rodar servidor no modo dev
CMD ["npm", "run", "start:dev"]
