#!/bin/zsh

rm -rf ./report/*
deno test ./tests/unit/database/postgres_lite/* --allow-env --env-file --allow-read --reporter=junit --junit-path=./report/db_unit.xml
deno test ./src/core/tests/unit/* ./tests/unit/core/* --allow-env --env-file --allow-read --reporter=junit --junit-path=./report/core_unit.xml
allure generate ./report ./allure-report --clean