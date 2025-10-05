import {
	createUInt,
	Feed,
	Password,
	Podcast,
	Subscribe,
	User,
} from "@podcast/core";

export class UserMother {
	public createUser(): User {
		const userId = createUInt(1);
		const userLogin = "test";
		const userPassword = new Password("test");
		return new User(userId, userLogin, userPassword);
	}
}

export class SubscribeMother {
	public createYoutubeSubscribe(): Subscribe {
		const subscribeId = createUInt(1);
		const subscribeTitle = "test";
		const subscribeUrl = new URL("https://www.youtube.com/@MrVrschool");
		const subscribePlatform = "youtube";
		return new Subscribe(
			subscribeId,
			subscribeUrl,
			subscribeTitle,
			subscribePlatform,
		);
	}

	public createInMemorySubscribe(): Subscribe {
		const subscribeId = createUInt(1);
		const subscribeTitle = "test";
		const subscribeUrl = new URL("https://www.youtube.com/@MrVrschool");
		const subscribePlatform = "in-memory";
		return new Subscribe(
			subscribeId,
			subscribeUrl,
			subscribeTitle,
			subscribePlatform,
		);
	}
}

export class PodcastMother {
	public createYoutubePodcast(): Podcast {
		const url = new URL(
			"https://www.youtube.com/watch?v=4xST-Kz9pEI",
		);
		const platform = "youtube";
		const title = "test";
		const durationInSeconds = createUInt(10 * 60 + 3);
		const relevance = new Date("2019-11-23");
		return new Podcast(url, title, platform, durationInSeconds, relevance);
	}

	public createInMemoryPodcast(): Podcast {
		const url = new URL(
			"https://www.youtube.com/watch?v=4xST-Kz9pEI",
		);
		const platform = "in-memory";
		const title = "test";
		const durationInSeconds = createUInt(10 * 60 + 3);
		const relevance = new Date("2019-11-23");
		return new Podcast(url, title, platform, durationInSeconds, relevance);
	}
}

export class FeedMother {
	private readonly userMother: UserMother;

	constructor() {
		this.userMother = new UserMother();
	}

	public createFeed(): Feed {
		const user = this.userMother.createUser();
		return new Feed(user.id, 1);
	}
}
