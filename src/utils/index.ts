import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import dayjs from 'dayjs'
import { Context } from 'vm';

const getAccessExpiry = () => dayjs().add(1, "d").toDate()
const getRefreshExpiry = () => dayjs().add(30, 'd').toDate()

const APP_SECRET = 'backbus123'
const REFRECH_SECRET = "backbus321"


interface Token {
    userId: string
}

export function getUserId(context: Context) {
    const authHeader = context.req.headers.authorization
    if (authHeader) {
        const token = authHeader.replace('Bearer ', '')
        const verifiedToken = verify(token, APP_SECRET) as Token
        return verifiedToken && Number(verifiedToken.sub)
    }
}

export async function handleSignIn(user: any, prisma: PrismaClient) {
    const { refreshToken } = getJwtRefreshToken(
        user.id,
        user,
    );

    const { accessToken } = getJwtAccessToken(
        user.id,
        user,
    );
    try {
        const hashValue = await hash(refreshToken, 10)
        const token = await prisma.token.create({
            data: {
                expiresAt: getRefreshExpiry(),
                refreshToken: hashValue,
                user: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        })

        return {
            accessToken,
            refreshToken,
            tokenId: token.id,
            accessTokenExpires: getAccessExpiry(),
            user,
        }
    } catch (error) {
        // console.log(user, error)
    }
}

function getJwtRefreshToken(
    sub: any,
    user: any,
    isSecondFactorAuthenticated = false) {
    const payload = { sub, user };
    const refreshToken = sign(payload, REFRECH_SECRET, {
        expiresIn: "30 days",
    });
    return {
        refreshToken,
    };
}

function getJwtAccessToken(
    sub: any,
    user: any,
    isSecondFactorAuthenticated = false
) {
    const payload = {
        sub,
        user,
        isSecondFactorAuthenticated,
    };
    const accessToken = sign(payload, APP_SECRET, {
        expiresIn: "1d",
    });
    return {
        accessToken,
    };
}
