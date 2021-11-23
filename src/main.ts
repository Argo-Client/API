import { Logger, VersioningType } from "@nestjs/common";
import { json, urlencoded } from "body-parser";

import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";

const bootstrap = async () => {
	const app = await NestFactory.create(AppModule, {
		bodyParser: false,
	});

	const rawBodyBuffer = (req, res, buf, encoding) => {
		if (buf && buf.length) {
			req.rawBody = buf.toString(encoding || "utf8");
		}
	};

	app.use(urlencoded({ verify: rawBodyBuffer, extended: true }));
	app.use(json({ verify: rawBodyBuffer }));

	app.enableVersioning({
		type: VersioningType.URI,
	});

	const logger = new Logger("NestApplication");

	if (!process.env.WEBHOOK_TOKEN || !process.env.UPLOAD_TOKEN)
		logger.warn(
			"WEBHOOK_TOKEN or UPLOAD_TOKEN env is not set, disabling builder.",
		);

	await app.listen(process.env.PORT ?? 3000);
};

bootstrap();
