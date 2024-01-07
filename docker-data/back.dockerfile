FROM node:lts
# vue-cli reqires 8.10.0+ 

RUN apt-get update && \
	apt-get -y --no-install-recommends install tzdata && \
	ln -sf /usr/share/zoneinfo/Europe/Paris /etc/localtime && \
	echo "Europe/Paris" > /etc/timezone && \
	dpkg-reconfigure -f noninteractive tzdata && \
	apt-get autoremove -y && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/*

WORKDIR /app
# RUN npm global add @vue/cli

EXPOSE 8000


ENTRYPOINT ["/bin/sh", "-c", "npm install && npm run start -- --port 8000 --host"]