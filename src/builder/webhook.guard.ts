import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "crypto";

import { GITHUB_EVENT_HEADER } from "./constants";
import { GITHUB_EVENT_TYPE } from "../commits/interfaces/commit.interface";
import { Observable } from "rxjs";
import { Request } from "../interfaces/request.interface";

@Injectable()
export class WebhookGuard implements CanActivate {
	private eventHeaderName = GITHUB_EVENT_HEADER;
	private sigHeaderName = "X-Hub-Signature-256";
	private sigHashAlg = "sha256";

	validateRequest(req: Request): boolean {
		if (!process.env.WEBHOOK_TOKEN) return false;

		const validHookTypes =
			req.get(this.eventHeaderName) == GITHUB_EVENT_TYPE.PUSH ||
			req.get(this.eventHeaderName) == GITHUB_EVENT_TYPE.WORKFLOW;

		const sig = Buffer.from(req.get(this.sigHeaderName) || "", "utf8");

		const hmac = createHmac(this.sigHashAlg, process.env.WEBHOOK_TOKEN);

		const digest = Buffer.from(
			this.sigHashAlg + "=" + hmac.update(req.rawBody).digest("hex"),
			"utf8",
		);

		return (
			!(sig.length !== digest.length || !timingSafeEqual(digest, sig)) &&
			validHookTypes
		);
	}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();

		return this.validateRequest(request);
	}
}
