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

# RUN npm install -g npm@10.2.5

# RUN npm global add @vue/cli

WORKDIR /app
COPY package.json ./
RUN npm install --loglevel verbose
COPY . .

EXPOSE 80

ENTRYPOINT ["/bin/sh", "-c", "npm i && npm run dev -- --port 80 --host"]
# ENTRYPOINT ["/bin/sh", "-c", "npm i && npm run build -- --port 80 --host"]