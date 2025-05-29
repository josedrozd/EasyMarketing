FROM maven:3.9.0-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/target/easymarketing-0.0.1-SNAPSHOT.jar app.jar
COPY wait-for-mysql.sh /wait-for-mysql.sh

RUN echo "deb https://archive.ubuntu.com/ubuntu jammy main restricted universe multiverse\n\
deb https://archive.ubuntu.com/ubuntu jammy-updates main restricted universe multiverse\n\
deb https://archive.ubuntu.com/ubuntu jammy-security main restricted universe multiverse" > /etc/apt/sources.list && \
    apt-get update && apt-get install -y default-mysql-client && chmod +x /wait-for-mysql.sh

ENTRYPOINT ["/wait-for-mysql.sh", "db:3306", "--", "java", "-jar", "app.jar"]
