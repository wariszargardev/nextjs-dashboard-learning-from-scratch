import prisma from "@/lib/db";
import { Customer } from "./definitions";

export default async function fetchCustomers(): Promise<Customer[]> {
    const customers = await prisma.customer.findMany()
    return customers.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        image_url: c.imageUrl,
    }))
}