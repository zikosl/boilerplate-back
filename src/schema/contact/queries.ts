import { extendType, intArg, nonNull } from "nexus"
import { Context } from "../../context"
import { GraphQLError } from "graphql"
import { getUserId } from "../../utils"

export const Query = extendType({
    type: 'Query',
    definition(t) { },
})

export default Query