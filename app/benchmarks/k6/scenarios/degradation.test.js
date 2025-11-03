import http from "k6/http";

export const options = {
  stages: [
    { duration: '1m', target: 200 },  // нагрузка выше нормы — перегруз
    { duration: '1m', target: 200 },
    { duration: '30s', target: 50 },  // спад до обычного уровня
    { duration: '5m', target: 50 },   // период восстановления
  ],
};
