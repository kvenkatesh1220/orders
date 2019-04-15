# orders

docker build -t database-service:v0.4 . : build docker image
docker images: list images
docker run --name database-service -p 8081:8081 database-service:v0.4 : run image
docker ps : list active containers
docker stop 'name of container': stop container
docker container ls -a : list all containers
docker rm 'name of container' - delete container
