FROM denoland/deno:latest
RUN apt-get update && \
    apt-get install -y curl unzip default-jre && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g allure-commandline && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
RUN chmod +x ./tests/scripts/run_tests.sh
RUN deno cache ./src/main.ts
ENTRYPOINT ["./tests/scripts/run_tests.sh"]