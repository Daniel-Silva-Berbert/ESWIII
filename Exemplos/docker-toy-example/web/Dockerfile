# Etapa de build: instala dependencias e gera os arquivos estaticos do Vite.
FROM node:lts-alpine AS build

# Define o diretorio de trabalho dentro do container.
WORKDIR /app

# Copia primeiro os manifests do npm para aproveitar o cache de dependencias.
COPY package*.json ./
RUN npm ci

# Copia os arquivos de configuracao e o codigo-fonte da aplicacao.
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src ./src

# Define a URL usada pelo Vite durante o build.
ARG VITE_API_URL=http://localhost:5173
ENV VITE_API_URL=$VITE_API_URL

# Compila o TypeScript e gera o build estatico na pasta dist.
RUN npm run build

# Etapa final: usa nginx para servir os arquivos estaticos gerados.
FROM nginx:alpine AS production

# Substitui a configuracao padrao do nginx pela configuracao da aplicacao.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build da etapa anterior para a pasta publica do nginx.
COPY --from=build /app/dist /usr/share/nginx/html

# Documenta que o container escuta na porta 80.
EXPOSE 80

# Mantem o nginx em primeiro plano para o container continuar em execucao.
CMD ["nginx", "-g", "daemon off;"]
