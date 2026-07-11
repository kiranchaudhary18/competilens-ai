import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  fullName: string;
  workspaceId?: string;
}

export class TokenService {
  private static getSecrets() {
    const accessSecret = process.env.JWT_SECRET || "competilens_jwt_default_access_secret_123456";
    const refreshSecret = process.env.JWT_REFRESH_SECRET || "competilens_jwt_default_refresh_secret_123456";
    return { accessSecret, refreshSecret };
  }

  public static generateAccessToken(payload: TokenPayload): string {
    const { accessSecret } = this.getSecrets();
    return jwt.sign(payload, accessSecret, { expiresIn: "15m" });
  }

  public static generateRefreshToken(payload: TokenPayload): string {
    const { refreshSecret } = this.getSecrets();
    return jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
  }

  public static verifyAccessToken(token: string): TokenPayload {
    const { accessSecret } = this.getSecrets();
    return jwt.verify(token, accessSecret) as TokenPayload;
  }

  public static verifyRefreshToken(token: string): TokenPayload {
    const { refreshSecret } = this.getSecrets();
    return jwt.verify(token, refreshSecret) as TokenPayload;
  }
}
