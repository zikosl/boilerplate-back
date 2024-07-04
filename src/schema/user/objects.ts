import { objectType } from "nexus"

const User = objectType({
    name: 'User',
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('email')
        t.string('firstname')
        t.string('lastname')
        t.int('city')
        t.field('birthday', { type: "DateTime" })
    },
})

const AuthPayload = objectType({
    name: 'AuthPayload',
    definition(t) {
        t.string('accessToken')
        t.string('refreshToken')
        t.string('tokenId')
        t.field("accessTokenExpires", { type: "DateTime" })
        t.field('user', { type: 'User' })
    },
})
export default { User, AuthPayload } 
