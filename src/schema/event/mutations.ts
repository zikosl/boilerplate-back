import { arg, extendType, intArg, nonNull, objectType, stringArg } from "nexus"
import { Context } from "../../context"
import { GraphQLError } from 'graphql'
import { sign, verify } from "jsonwebtoken"
import { generateRandomPassword } from "../../utils/password"
import { sendEmail, sendEmailAttached } from "../../utils/mailer"
import dayjs from "dayjs"
import { getUserId } from "../../utils"
import { genTicket, generatePdfTicket } from "../../utils/pdf"



const Mutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.string('createClientTicket', {
            args: {
                eventId: nonNull(intArg()),
                firstname: nonNull(stringArg()),
                lastname: nonNull(stringArg()),
                email: nonNull(stringArg()),
                nin: nonNull(stringArg()),
                phone: nonNull(stringArg()),
                date: nonNull(arg({ type: "DateTime" })),
            },
            resolve: async (_parent, args, context: Context) => {
                try {
                    let password = generateRandomPassword(18)
                    let state = 0
                    const event = await context.prisma.event.findUnique({
                        where: {
                            id: args.eventId
                        }
                    })
                    if (!event) {
                        return new GraphQLError("Please select an event")
                    }
                    if (dayjs(event.date).diff(dayjs(args.date)) > 0) {
                        return new GraphQLError("This date inavailable")
                    }
                    let user = await context.prisma.user.findUnique({
                        where: {
                            email: args.email
                        }
                    })
                    if (!user) {
                        user = await context.prisma.user.create({
                            data: {
                                email: args.email,
                                password: password,
                                firstname: args.firstname,
                                lastname: args.lastname,
                                lastRequest: dayjs().subtract(1, "h").format()
                            }
                        })
                        const emailToken = sign({
                            email: user.email
                        }, process.env.EMAIL_SECRET, { expiresIn: '24h' });

                        try {
                            await context.prisma.user.update({
                                data: {
                                    lastRequest: dayjs().format()
                                },
                                where: {
                                    id: user.id
                                }
                            })
                            state = 1
                        } catch (e) {
                            state = 2
                        }
                    }
                    const ticket = await context.prisma.clientTicket.create({
                        data: {
                            firstname: args.firstname,
                            eventId: event.id,
                            lastname: args.lastname,
                            nin: args.nin,
                            date: args.date,
                            userId: user.id
                        }
                    })
                    let htmlContent = genTicket({
                        firstname: ticket.firstname,
                        lastname: ticket.lastname,
                        event: event.name,
                        date: ticket.date
                    }, ticket.id)
                    console.log(htmlContent)
                    const ticketFile = await generatePdfTicket(htmlContent)
                    console.log(ticketFile)
                    if (state == 0) {
                        await sendEmailAttached({
                            url: "",
                            email: user.email,
                            additional: "",
                            file: ticketFile
                        });
                        return "your ticket created and added to your account"

                    }
                    else {
                        if (state == 1) {
                            await sendEmailAttached({
                                url: process.env.NEXT_URL + `/token/${emailToken}`,
                                email: user.email,
                                additional: password,
                                file: ticketFile
                            });
                            return "your account and ticket created and sent to your email"
                        }
                        else {
                            await sendEmailAttached({
                                url: "",
                                email: user.email,
                                additional: "",
                                file: ticketFile
                            });
                            return "ticket sent to your email"
                        }
                    }
                }
                catch (e) {
                    console.log(e)
                    return new GraphQLError("Something wrong")
                }
            },
        })
        t.field('createUserTicket', {
            type: "ClientTicket",
            args: {
                eventId: nonNull(intArg()),
                firstname: nonNull(stringArg()),
                lastname: nonNull(stringArg()),
                nin: nonNull(stringArg()),
                date: nonNull(arg({ type: "DateTime" })),
            },
            resolve: async (_parent, args, context: Context) => {
                const userId = getUserId(context)

                const event = await context.prisma.event.findUnique({
                    where: {
                        id: args.eventId
                    }
                })
                if (!event) {
                    return new GraphQLError("Please select an event")
                }
                if (dayjs(event.date).diff(dayjs(args.date)) > 0) {
                    return new GraphQLError("This date inavailable")
                }
                return context.prisma.clientTicket.create({
                    data: {
                        firstname: args.firstname,
                        eventId: event.id,
                        lastname: args.lastname,
                        nin: args.nin,
                        date: args.date,
                        userId: userId
                    }
                })
            },
        })
    },
})



export default Mutation