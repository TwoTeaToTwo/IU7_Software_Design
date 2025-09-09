export class LoginViewModel {
    public static async login(
        login: string,
        password: string,
    ) {
        await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login: login,
                password: password,
            }),
        });
    }
}
