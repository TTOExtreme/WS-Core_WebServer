# WSCore WebServer

Módulo de Webserver do WSCore

Para criar um Certificado SSL Generico:

openssl req -x509 -nodes -newkey rsa:4096 -keyout certs/servidor.key -out certs/servidor.crt -sha256 -days 365