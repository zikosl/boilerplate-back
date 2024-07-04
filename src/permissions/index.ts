import { allow, rule, shield } from 'graphql-shield'
import { getUserId } from '../utils'
import { Context } from '../context'

const rules = {
  isAuthenticatedUser: rule()((_parent, _args, context: Context) => {
    const userId = getUserId(context)
    return Boolean(userId)
  }),

}


export const permissions = shield({
  Query: {
    "*": allow,
  },
  Mutation: {
    "*": allow
  },
}, {
  fallbackRule: allow
})