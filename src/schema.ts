import { permissions } from './permissions'
import { applyMiddleware } from 'graphql-middleware'

import {
  asNexusMethod,
  makeSchema,
} from 'nexus'
import User from './schema/user'
import Event from './schema/event'
import Contact from './schema/contact'

import { DateTimeResolver } from 'graphql-scalars'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')


const schemaWithoutPermissions = makeSchema({
  types: [
    User,
    Event,
    DateTime,
    Contact
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

//applyMiddleware(schemaWithoutPermissions, permissions)

export const schema = schemaWithoutPermissions
