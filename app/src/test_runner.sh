!#/bin/zsh

rm -rf ./report/*
deno test ./database/postgres_lite/tests/unit/*.test.ts ./core/tests/unit/london/* --env-file --allow-env --allow-read --reporter=junit --junit-path=./report/report.xml
allure generate ./report allure-report --clean