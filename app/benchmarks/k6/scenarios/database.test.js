import http from "k6/http";
import { check, sleep, group } from "k6";
import { Trend, Rate, Counter } from "k6/metrics";

// Метрики
const loginTime = new Trend("login_time");
const accessTokenTime = new Trend("access_token_time");
const userChannelsTime = new Trend("user_channels_time");
const errorRate = new Rate("errors");
const requestCount = new Counter("total_requests");

// Опции теста
export const options = {
  vus: 1,          // один виртуальный пользователь
  iterations: 1,   // один прогон сценария
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<800"],
    "user_channels_time": ["p(95)<500"],
  },
};

// Хост
const HOST = __ENV.HOST || "backend";
const PORT = __ENV.PORT || "32486";
const BASE_URL = `http://${HOST}:${PORT}/api/v1`;

export default function () {
  // 1️⃣ Логин
  group("login", function () {
    const payload = JSON.stringify({
      login: `${Math.floor(Math.random() * 1000)}`, // случайный юзер
      password: "1234",
    });

    const params = {
      headers: { "Content-Type": "application/json" },
    };

    const start = Date.now();
    const res = http.post(`${BASE_URL}/sessions`, payload, params);
    const duration = Date.now() - start;
    loginTime.add(duration);

    check(res, {
      "login status 201": (r) => r.status === 201,
      "has cookie": (r) => r.cookies["refresh_token"]?.length > 0,
    }) || errorRate.add(1);

    requestCount.add(1);

    // Извлекаем refresh_token из cookie
    const refresh_token = res.cookies["refresh_token"]?.[0]?.value;
    if (!refresh_token) {
      return;
    }

    // 2️⃣ Получение access_token
    group("access_token", function () {
      const start = Date.now();
      const res2 = http.post(`${BASE_URL}/sessions/access_token`, JSON.stringify({}), {
        headers: { "Content-Type": "application/json", "Cookie": `refresh_token=${refresh_token}` },
      });
      const duration = Date.now() - start;
      accessTokenTime.add(duration);

      check(res2, {
        "access token ok": (r) => r.status === 201,
        "access token exists": (r) => JSON.parse(r.body).accessToken !== undefined,
      }) || errorRate.add(1);

      requestCount.add(1);

      const access_token = JSON.parse(res2.body).accessToken;

      // 3️⃣ Запрос подписок
      group("user_channels", function () {
        const start = Date.now();
        const res3 = http.get(`${BASE_URL}/users/channels?page=1&channels_per_page=5`, {
          headers: { "Authorization": `Bearer ${access_token}` },
        });
        const duration = Date.now() - start;
        userChannelsTime.add(duration);

        check(res3, {
          "channels status 200": (r) => r.status === 200,
          "channels valid json": (r) => {
            try {
              const body = JSON.parse(r.body);
              return Array.isArray(body.channels);
            } catch {
              return false;
            }
          },
        }) || errorRate.add(1);

        requestCount.add(1);
      });
    });
  });

  sleep(1);
}
