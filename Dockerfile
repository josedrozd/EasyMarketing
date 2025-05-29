FROM maven:3.9.0-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk
WORKDIR /app
RUN sed -i 's|http://archive.ubuntu.com/ubuntu|http://mirror.uba.ar/ubuntu|g' /etc/apt/sources.list && \
    sed -i 's|http://security.ubuntu.com/ubuntu|http://mirror.uba.ar/ubuntu|g' /etc/apt/sources.list
RUN apt-get update && apt-get install -y openjdk-17-jdk default-mysql-client && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/easymarketing-0.0.1-SNAPSHOT.jar app.jar
COPY wait-for-mysql.sh /wait-for-mysql.sh
RUN chmod +x /wait-for-mysql.sh

ENTRYPOINT ["/wait-for-mysql.sh", "db:3306", "--", "java", "-jar", "app.jar"]
