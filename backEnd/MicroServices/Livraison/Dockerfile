FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/livraison-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]