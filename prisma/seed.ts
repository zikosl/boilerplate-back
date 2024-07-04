import { PrismaClient, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()
const event = [
  {
    name: "Pirate Ship event",
    address: "Sablette,Hussein Dey Algiers",
    date: dayjs("2024-07-05").format()
  }
]


async function main() {
  console.log(`Start seeding ...`)
  await prisma.event.createMany({
    data: event
  })
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    await prisma.$disconnect()
    process.exit(1)
  })
