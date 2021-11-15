import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class BuilderGuard implements CanActivate {
  private tokenPrefix = "Bearer ";

  checkBearerToken(req: any): boolean {
    const authHeader: string | void = req.headers["authorization"];

    if (authHeader && process.env.UPLOAD_TOKEN) {
      const token = authHeader.slice(
        this.tokenPrefix.length,
        authHeader.length
      );

      return token && token == process.env.UPLOAD_TOKEN;
    }
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.checkBearerToken(request);
  }
}
