1. docker build . -t madi2/clinic:dev-1.0.0
2. docker push madi2/clinic:dev-1.0.0


# serveur
docker pull madi2/clinic:dev-1.0.0 && docker rm -f  clinic && docker run -d -p 8002:80 --name clinic madi2/clinic:dev-1.0.0


