#!/bin/bash
set -e

HOST="${DB_HOST}"
USER="${SPRING_DATASOURCE_USERNAME}"
PASSWORD="${SPRING_DATASOURCE_PASSWORD}"
DATABASE="${MYSQL_DATABASE}"

until mysql -h"$HOST" -u"$USER" -p"$PASSWORD" "$DATABASE" -e "SELECT 1;" > /dev/null 2>&1; do
  echo "Esperando a que MySQL esté listo..."
  sleep 5
done

exec java -jar app.jar
