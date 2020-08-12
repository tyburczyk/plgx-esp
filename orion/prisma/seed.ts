import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function getTags() {
  let tags = await db.node_tags.findOne({
    where: {
      node_id_tag_id: {
        node_id: 1,
        tag_id: 1
      }
    }
  })

  console.log(tags)
}

getTags()
