#!/bin/sh
set -e

cp /docker-entrypoint-initdb.d/pg_hba.conf "$PGDATA/pg_hba.conf"