#!/bin/bash

set -e

DOMAIN="bogrom.pl"
EMAIL="biuro@bogrom.pl"

echo "🚀 Rozpoczynamy wdrożenie dla $DOMAIN..."

echo "1. Zatrzymywanie starych kontenerów..."
docker-compose down

echo "2. Tworzenie katalogów dla certyfikatów..."
mkdir -p ./data/certbot/conf
mkdir -p ./data/certbot/www

echo "3. Budowanie obrazów"
docker-compose build --no-cache

echo "4. Uruchamianie tymczasowego Nginx w tle..."

docker-compose run -d --name temp-nginx -p 80:80 --rm -v "$(pwd)/frontend/nginx-certbot.conf:/etc/nginx/conf.d/default.conf" nginx

echo "5. Oczekiwanie na start Nginxa..."
sleep 3

echo "6. Generowanie lub weryfikacja certyfikatu Let's Encrypt..."
if [ -d "./data/certbot/conf/live/$DOMAIN" ]; then
  echo "Certyfikat dla $DOMAIN już istnieje na dysku. Pomijam wymuszanie generowania."
else
  echo "Brak certyfikatu. Rozpoczynam generowanie nowego..."
  docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email
fi

echo "7. Zatrzymywanie tymczasowego Nginxa..."
docker stop temp-nginx

echo "8. Startowanie pełnej infrastruktury produkcyjnej..."
docker-compose up -d

echo "9. Inicjalizacja/Seeding bazy danych Prisma..."

sleep 5
docker-compose exec backend npx prisma db seed

echo "✅ Wdrożenie zakończone sukcesem! Aplikacja jest dostępna pod https://$DOMAIN"