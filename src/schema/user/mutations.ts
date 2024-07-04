import { arg, intArg, nonNull, objectType, stringArg } from "nexus"
import { Context } from "../../context"
import { GraphQLError } from 'graphql'
import { getUserId, handleSignIn } from "../../utils"
import { sign, verify } from "jsonwebtoken"
import { sendEmail } from "../../utils/mailer"
import dayjs from "dayjs"



const Mutation = objectType({
    name: 'Mutation',
    definition(t) {
        t.field('signIn', {
            type: 'AuthPayload',
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg())
            },
            resolve: async (_parent, args, context: Context) => {
                args.email = args.email.toLowerCase()
                const value = await context.prisma.user.findUnique({
                    where: {
                        email: args.email
                    }
                })
                let items = null
                if (!value) {
                    items = await context.prisma.user.create({
                        data: {
                            email: args.email,
                            password: args.password,
                            lastRequest: dayjs().subtract(1, "h").format()
                        }
                    })
                }
                else {
                    items = await context.prisma.user.findFirst({
                        where: {
                            email: args.email,
                            password: args.password
                        }
                    })
                    if (!items) {
                        return new GraphQLError("Invalid Password")
                    }
                }
                if (items.verified) {
                    const user = await handleSignIn(items, context.prisma)
                    return user
                }
                if (items.token != "") {
                    try {
                        let payload = await verify(items.token, process.env.EMAIL_SECRET)
                        if (payload) {
                            return new GraphQLError("check your email for verification url")
                        }
                    }
                    catch (e) {

                    }
                }
                const emailToken = sign({
                    email: items.email
                }, process.env.EMAIL_SECRET, { expiresIn: '24h' });

                try {
                    await context.prisma.user.update({
                        data: {
                            token: emailToken
                        },
                        where: {
                            id: items.id
                        }
                    })
                }
                catch (e) {
                    return new GraphQLError("Somthing wrong try again later")
                }
                try {
                    await sendEmail({
                        url: process.env.NEXT_URL + `/token/${emailToken}`,
                        email: items.email
                    });

                    await context.prisma.user.update({
                        data: {
                            lastRequest: dayjs().format()
                        },
                        where: {
                            id: items.id
                        }
                    })

                    return new GraphQLError("Email with verification sent to your email")
                } catch (error) {
                    return new GraphQLError("Somthing wrong try to request token again")
                }
            },
        })
        t.field('updateProfile', {
            type: "AuthPayload",
            args: {
                firstname: nonNull(stringArg()),
                lastname: nonNull(stringArg()),
                birthday: nonNull(arg({ type: "DateTime" })),
                city: nonNull(intArg())
            },
            resolve: async (_parent, args, context: Context) => {
                args.firstname = args.firstname.toLowerCase()
                args.lastname = args.lastname.toLowerCase()
                const userId = getUserId(context)
                try {
                    const value = await context.prisma.user.update({
                        where: {
                            id: userId
                        },
                        data: args
                    })
                    const token = await handleSignIn(value, context.prisma)
                    return token
                }
                catch (e) {
                    return new GraphQLError("Something wrong")
                }
            },
        })
        t.boolean('verifyUser', {
            args: {
                email: nonNull(stringArg()),
            },
            resolve: async (_parent, { email }, context: Context) => {
                const value = await context.prisma.user.findUnique({
                    where: {
                        email: email,
                    }
                })
                if (!value) {
                    return new GraphQLError("you dont have an account please create one")
                }

                if (dayjs().diff(dayjs(value.lastRequest).diff(), "second") <= 3600) {
                    return new GraphQLError("check your inbox email already sent")
                }
                if (value.verified) {
                    return new GraphQLError("account already verified just login")
                }
                let payload = await verify(value.token, process.env.EMAIL_SECRET)
                if (payload) {
                    return new GraphQLError("check your inbox email already sent")
                }

                const emailToken = sign({
                    email: value.email
                }, process.env.EMAIL_SECRET, { expiresIn: '24h' });

                await sendEmail({
                    url: process.env.NEXT_URL + `/token/${emailToken}`,
                    email: value.email,
                    additional: value.random ? value.password : ""
                });
                return true
            },
        })
    },
})



export default Mutation