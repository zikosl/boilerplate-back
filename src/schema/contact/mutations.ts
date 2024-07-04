import { arg, extendType, intArg, nonNull, objectType, stringArg } from "nexus"
import { Context } from "../../context"
import { GraphQLError } from 'graphql'
import { sign, verify } from "jsonwebtoken"
import { generateRandomPassword } from "../../utils/password"
import { sendEmail } from "../../utils/mailer"
import dayjs from "dayjs"
import { getUserId } from "../../utils"



const Mutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.boolean('createInquire', {
            args: {
                fullname: nonNull(stringArg()),
                phone: nonNull(stringArg()),
                email: nonNull(stringArg()),
                message: nonNull(stringArg()),
            },
            resolve: async (_parent, args, context: Context) => {
                try {
                    await context.prisma.contact.create({
                        data: {
                            fullname: args.fullname,
                            phone: args.phone,
                            email: args.email,
                            message: args.message,
                        }
                    })
                    return true
                }
                catch (e) {
                    return false
                }
            },
        })
    },
})



export default Mutation