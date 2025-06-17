#!/bin/bash

SERVICE=${1:-"frontend"}
docker compose logs -f $SERVICE