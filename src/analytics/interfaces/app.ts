export interface PreferenceData {
	optIn: boolean;
	user: { id: string };
}

export type UpdateData = PreferenceData & {
	user: {
		school: string;
	};
	device: {
		type: "android" | "ios";
		version: string;
	};
	app: {
		version: string;
		source: "playstore" | "github";
	};
};
