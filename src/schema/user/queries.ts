import { nonNull, objectType, stringArg } from "nexus"
import { verify } from "jsonwebtoken"
import { Context } from "../../context"
import { GraphQLError } from "graphql"

export const Query = objectType({
    name: 'Query',
    definition(t) {
        t.boolean('verifyUser', {
            args: {
                token: nonNull(stringArg())
            },
            resolve: async (_parent, args, context: Context) => {
                try {
                    let payload = await verify(args.token, process.env.EMAIL_SECRET)
                    if (payload) {
                        let value = await context.prisma.user.findFirst({
                            where: {
                                email: payload.email,
                                verified: false
                            }
                        })
                        if (!value) {
                            return new GraphQLError("user already verified")
                        }

                        value = await context.prisma.user.update({
                            where: {
                                email: payload.email
                            },
                            data: {
                                token: "",
                                verified: true
                            }
                        })
                        if (value) {
                            return true
                        }
                    }
                } catch (e) {
                }
                return new GraphQLError("invalid url please check your email or request another token")
            },
        })
    },
})

export default Query