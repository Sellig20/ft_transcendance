FROM node:lts
# vue-cli reqires 8.10.0+ 

RUN apt-get update && \
	apt-get -y --no-install-recommends install tzdata iputils-ping && \
	ln -sf /usr/share/zoneinfo/Europe/Paris /etc/localtime && \
	echo "Europe/Paris" > /etc/timezone && \
	dpkg-reconfigure -f noninteractive tzdata && \
	apt-get autoremove -y && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install --loglevel verbose
COPY . .

# RUN ping database
# RUN npx prisma migrate dev

EXPOSE 8000

# ENTRYPOINT ["/bin/sh", "-c", "sleep 2 && npx prisma migrate dev --name init && npm run start"]
ENTRYPOINT ["/bin/sh", "-c", "sleep 2 && npx prisma db push --force-reset && npm run start:dev"]