import prisma from "@/lib/db";

export default async function Dashboard() {
  const user = await prisma.user.findFirst()
  return (
    <div>
        <h1>Customer Page - {user?.name}</h1>
    </div>
  )
}