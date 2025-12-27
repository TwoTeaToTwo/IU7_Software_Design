#!/bin/bash

JUNIT_PATH="./junit_report"
ALLURE_PATH="./allure-report"
SERVER_PID=""
SERVER_URL="http://127.0.0.1:32486/"

apply_migrations() {
    echo "start migrations"
    deno --env-file=./.env.test -A --node-modules-dir npm:drizzle-kit push --config=./src/database/postgres/drizzle.config.ts
    echo "end migrations"
}

clear_db() {
    echo "start clear db"
    deno run --allow-env --env-file=./.env.test --allow-read --allow-net ./tests/scripts/clear_test_database.ts
    echo "stop clear db"
}

fill_db() {
    echo "start fill db"
    deno run --allow-env --env-file=./.env.test --allow-read --allow-net ./tests/scripts/fill_test_database.ts
    echo "stop fill db"
}

start_server() {
    echo "starting server"
    deno run --allow-env --env-file=./.env.test --allow-net --allow-read --allow-write --allow-sys --allow-run=yt-dlp ./src/main.ts &
    SERVER_PID=$!
}

stop_server() {
    if [[ -n "$SERVER_PID" ]]; then
        kill "$SERVER_PID" 2>/dev/null || true
        wait "$SERVER_PID" 2>/dev/null || true
    fi
}

wait_server() {
    for i in {1..20}; do
        status_code=$(curl -o /dev/null -s -w "%{http_code}" "$SERVER_URL")

        if [[ "$status_code" -ge 200 && "$status_code" -lt 500 ]]; then
            echo "server is ready (status $status_code)"
            return 0
        fi

        echo "waiting server attempt $i (status $status_code)"
        sleep 1
    done
    stop_server
}

run_units() {
    echo "run unit testing"
    deno test ./tests/unit/database/postgres_lite/* --allow-env --env-file=./.env.test --allow-read --reporter=junit --junit-path="$JUNIT_PATH"/db_unit.xml
    deno test ./src/core/tests/unit/* ./tests/unit/core/* --allow-env --env-file=./.env.test --allow-read --reporter=junit --junit-path="$JUNIT_PATH"/core_unit.xml
}

run_integrations() {
    apply_migrations
    echo "run integrations testing"
    deno test ./tests/integration/database/postgres/* --allow-env --env-file=./.env.test --allow-read --allow-net --reporter=junit --junit-path="$JUNIT_PATH"/db_it.xml
    deno test ./tests/integration/core/* --allow-env --env-file=./.env.test --allow-read --allow-net --reporter=junit --junit-path="$JUNIT_PATH"/core_it.xml
}

run_e2e() {
    apply_migrations
    fill_db
    start_server
    wait_server
    echo "run e2e testing"
    newman run ./tests/e2e/SearchPodcastByUrl.postman_collection.json -e ./tests/e2e/PodcastClient.postman_environment.json -r allure --reporter-allure-export
    stop_server
    clear_db
}

generate_report() {
    echo "start generating allure report"
    mkdir -p "$ALLURE_PATH"
    allure generate "$JUNIT_PATH" "allure-results" --clean -o "$ALLURE_PATH" --single-file
}

clean() {
    if [[ -d "$ALLURE_PATH" ]]; then
        rm -rf "$ALLURE_PATH"
    fi
    if [[ -d "$JUNIT_PATH" ]]; then
        rm -rf "$JUNIT_PATH"
    fi
    if [[ -d "allure-results" ]]; then
        rm -rf "allure-results"
    fi
}

case $1 in
    -u|--units)
        run_units
        ;;
    -i|--integration)
        run_integrations
        ;;
    -e|--end_to_end)
        run_e2e
        ;;
    -a|--all)
        run_units
        run_integrations
        run_e2e
        generate_report
        ;;
    --clear_db) 
        clear_db
        ;;
    -c|--clean)
        clean
        ;;
    -r|--report)
        generate_report
        ;;
    *)
        echo "Undefined flag: $1"
        exit 1
        ;;
esac