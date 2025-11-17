# Imagen base
FROM node:20-alpine

WORKDIR /app

# Copiamos dependencias primero (mejor cache)
COPY package.json package-lock.json ./

# Instalamos dependencias
RUN npm ci

# Instalamos "serve" global
RUN npm install -g serve

# Copiamos el resto del código
COPY . .

# Build de producción
RUN npm run build

# Exponemos el puerto
EXPOSE 3000

# Comando para servir la carpeta dist
CMD ["serve", "-s", "dist", "-l", "3000"]
