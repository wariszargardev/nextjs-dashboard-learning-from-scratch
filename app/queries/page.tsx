import prisma from "@/lib/db/prisma"

export default async function Queries() {
const users = await prisma.user.findMany({
    orderBy: [
        {
        email: "desc",
    },
    {
        id: 'asc'
    }
    ]
})
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users</h1>
      <pre className="bg-gray-900 text-green-400 text-sm p-4 rounded-lg overflow-auto">
        {JSON.stringify(users, null, 2)}
      </pre>
    </div>
  )
}