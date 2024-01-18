all: up

up:
	docker compose up --build --force-recreate #>> logs.txt #-d

down:
	docker compose down -v

ps:		
	docker compose ps -a
	docker ps -a

clean:	down
	docker system prune --force
	docker volume prune --force


re : 	clean up

dbin : 
	PGPASSWORD=pass psql -p 5434 -h localhost -d db_test -U postgresql

db: 
	docker exec -it db bash

back-end: 
	docker exec -it back-end bash

front-end: 
	docker exec -it front-end bash

.PHONY: up down re ps clean front-end back-end db