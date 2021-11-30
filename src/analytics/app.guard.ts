import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { Observable } from "rxjs";
import { Request } from "@src/interfaces/request.interface";

@Injectable()
export class AppGuard implements CanActivate {
	private readonly APP_USER_AGENT = "Argo/App";

	verifyUserAgent(req: Request): boolean {
		return req.get("User-Agent") == this.APP_USER_AGENT;
	}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();

		return this.verifyUserAgent(request);
	}
}
