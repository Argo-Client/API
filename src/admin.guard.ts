import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { Observable } from "rxjs";
import { Request } from "./interfaces/request.interface";

@Injectable()
export class AdminGuard implements CanActivate {
	private tokenPrefix = "Bearer ";

	checkBearerToken(req: Request): boolean {
		const authHeader: string | void = req.headers.authorization;

		if (authHeader && process.env.ADMIN_TOKEN) {
			const token = authHeader.slice(
				this.tokenPrefix.length,
				authHeader.length,
			);

			return token && token == process.env.ADMIN_TOKEN;
		}
	}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();

		return this.checkBearerToken(request);
	}
}
