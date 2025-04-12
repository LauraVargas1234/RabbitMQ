1. Clone el repositorio "https://github.com/LauraVargas1234/RabbitMQ.git"
asegurese de usar la rama master y de tener docker y docker-compose instalado 

2. Use "docker-compose up --build" para correr los contenedores

4. En enlace "http://localhost:15672/" use laura como usuario y 123 como contraseña
   
6. Vaya a la pestaña de "queues and Streams" y verifique que este la cola "analytics_exchange"

7. Verifique el funcionamiento de 
- http://localhost:3002/stats -> estadisticas
- http://localhost:3000/ -> panel visual
- http://localhost:15672/-> Vaya a Queues and Streams 
- http://localhost:3001/ -> Mensaje que indica si esta activa la conexion con RabbitMQ

8. En la consola verifique que este en el proyecto y ejecute:
   curl -X POST http://localhost:3001/send-data \
  -H "Content-Type: application/json" \
  -d '{"clientId":"ingrese_id","data":"ingrese_mensaje"}' 

Nota: Cambie ingrese_id por el nombre de usuario que desee, al igual que ingrese_mensaje por el mensaje que se va a enviar

7. Verifique que se haya actualizado el contador de mensajes en "http://localhost:3000/"
