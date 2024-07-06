import { extendType, intArg, nonNull } from "nexus"
import { Context } from "../../context"
import { GraphQLError } from "graphql"
import { getUserId } from "../../utils"

export const Query = extendType({
    type: 'Query',
    definition(t) {
        t.list.field('findManyEvent', {
            type: "Event",
            resolve: (_parent, args, context: Context) => {
                return context.prisma.event.findMany({
                    orderBy: {
                        id: "desc"
                    }
                })
            },
        })
        t.list.field('findManyClientTicket', {
            type: "ClientTicket",
            resolve: (_parent, args, context: Context) => {
                const userId = getUserId(context)
                return context.prisma.clientTicket.findMany({
                    where: {
                        userId: userId
                    },
                    orderBy: {
                        id: "desc"
                    }
                })
            },
        })
        t.field('findClientTicket', {
            type: "ClientTicket",
            args: {
                id: nonNull(intArg())
            },
            resolve: (_parent, args, context: Context) => {
                const userId = getUserId(context)
                return context.prisma.clientTicket.findFirst({
                    where: {
                        userId: userId,
                        id: args.id
                    }
                })
            },
        })

        t.boolean('printClientTicket', {
            args: {
                id: nonNull(intArg())
            },
            resolve: async (_parent, args, context: Context) => {
                const userId = getUserId(context)
                const ticket = await context.prisma.clientTicket.findFirst({
                    where: {
                        userId: userId,
                        id: args.id
                    }
                })
            },
        })
    },
})

export default Query