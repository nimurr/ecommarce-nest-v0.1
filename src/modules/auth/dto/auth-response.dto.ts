// DTO for auth resoponse

import { Role } from "@prisma/client";

export class AuthResponseDto {
    accessToken?: string;
    refreshToken?: string;
    user?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        role: Role
    };
}