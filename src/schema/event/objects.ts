import { objectType } from "nexus"

const Event = objectType({
    name: 'Event',
    definition(t) {
        t.nonNull.int('id')
        t.string('name')
        t.string('address')
        t.field('date', { type: "DateTime" })
    },
})

const ClientTicket = objectType({
    name: 'ClientTicket',
    definition(t) {
        t.nonNull.int('id')
        t.string('firstname')
        t.string('lastname')
        t.string('nin')
        t.int('status')
        t.field('date', { type: "DateTime" })
        t.field('user', {
            type: "User", resolve: (parent, _, context) => {
                return context.prisma.user.findUnique({
                    where: {
                        id: parent.userId
                    }
                })
            }
        })
        t.field('event', {
            type: "Event", resolve: (parent, _, context) => {
                return context.prisma.event.findUnique({
                    where: {
                        id: parent.eventId
                    }
                })
            }
        })
    },
})



export default { Event, ClientTicket } 
