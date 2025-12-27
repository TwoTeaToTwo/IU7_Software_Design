document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
        fetch("http://127.0.0.1/stab_status")
            .then(res => res.text())
            .then(text => {
                document.querySelector(".status-box").textContent = text;
            });
    }, 2000);
});
