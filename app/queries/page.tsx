import prisma from "@/lib/db/prisma"
import { randomInt, randomUUID } from "crypto"

export default async function Queries() {
const result = await prisma.$queryRaw`
  SELECT id, name FROM "User" WHERE role = 'ADMIN'`;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users</h1>
      <pre className="bg-gray-900 text-green-400 text-sm p-4 rounded-lg overflow-auto">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}