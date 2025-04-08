import type { Subscribe } from "../models/subscribe.ts";
import type { Id } from "../types.ts";

interface ISubscribeRepository {
	delete(subscribe: Subscribe): void;
	findById(subscribe_id: Id): Subscribe;
	save(subscribe: Subscribe): void;
	findByUserId(user_id: Id): Array<Subscribe>;
}
