#!/bin/bash

DOMAIN="bogrom.pl"
EMAIL="biuro@bogrom.pl"

echo "Zatrzymywanie i usuwanie starych kontenerów..."
docker-compose down --volumes

echo "Tworzenie pustych folderów dla Certbota..."
mkdir -p ./data/certbot/conf
mkdir -p ./data/certbot/www

echo "Budowanie obrazów Docker..."
docker-compose build --no-cache

echo "Uruchamianie Nginx w celu weryfikacji domeny przez Certbot..."
docker-compose run --rm --service-ports -v "$(pwd)/frontend/nginx-certbot.conf:/etc/nginx/conf.d/default.conf" nginx

# Podczas pierwszego wdrażania
# Skrypt się zatrzyma, w między czasie w drugiej konsoli wykonać:
# docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d bogrom.pl -d www.bogrom.pl --email biuro@bogrom.pl --agree-tos --no-eff-email
# Następnie wrócić do pierwszej i ctrl+c

echo "Uzyskiwanie certyfikatu Let's Encrypt..."
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email

echo "Zatrzymywanie tymczasowego Nginx..."
docker-compose down

echo "Uruchamianie całej aplikacji z HTTPS..."
docker-compose up -d

echo "Aplikacja została pomyślnie wdrożona i jest dostępna pod adresem https://$DOMAIN"

echo "Uruchamianie seedingu bazy danych..."
docker-compose exec backend npx prisma db seed
echo "Seeding zakończony."

read -p "Wciśnij ENTER, aby zakończyć..."