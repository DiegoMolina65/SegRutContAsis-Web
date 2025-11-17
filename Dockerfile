# Etapa 1: Build con Node sobre Windows
FROM mcr.microsoft.com/windows/servercore:ltsc2019 AS build

# Descargamos Node para Windows (Node 20)
ENV NODE_VERSION=20.11.1

# Instalación de Node en Windows
RUN powershell -Command \
    Invoke-WebRequest -OutFile node.msi https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-x64.msi ; \
    Start-Process msiexec.exe -ArgumentList '/i node.msi /qn /norestart' -NoNewWindow -Wait

WORKDIR /app

# Copiamos dependencias primero
COPY package.json package-lock.json ./

# Instalamos dependencias
RUN npm ci

# Instalamos "serve" globalmente (para servir dist)
RUN npm install -g serve

# Copiamos todo el proyecto
COPY . .

# Compilamos el build de producción
RUN npm run build


# Etapa 2: Imagen final para servir la app
FROM mcr.microsoft.com/windows/servercore:ltsc2019

# Instalar Node también en la imagen final (serve necesita node)
ENV NODE_VERSION=20.11.1

RUN powershell -Command \
    Invoke-WebRequest -OutFile node.msi https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-x64.msi ; \
    Start-Process msiexec.exe -ArgumentList '/i node.msi /qn /norestart' -NoNewWindow -Wait

WORKDIR /app

# Copiamos el build generado desde la etapa anterior
COPY --from=build /app/dist ./dist

# Exponemos puerto
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
