import { objectType } from "nexus"

const Contact = objectType({
    name: 'Contact',
    definition(t) {
        t.nonNull.int('id')
        t.string('fullname')
        t.string('email')
        t.string('phone')
        t.string('message')
        t.field('date', { type: "DateTime" })
    },
})




export default { Contact } 
