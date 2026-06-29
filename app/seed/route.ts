import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { invoices, customers, revenue, users } from '@/app/lib/placeholder-data';

async function seedUsers() {
  return Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: { name: user.name, email: user.email, password: hashedPassword },
      });
    }),
  );
}

async function seedCustomers() {
  return Promise.all(
    customers.map((customer) =>
      prisma.customer.upsert({
        where: { email: customer.email },
        update: {},
        create: { name: customer.name, email: customer.email, imageUrl: customer.image_url },
      }),
    ),
  );
}

async function seedInvoices(customerIdMap: Record<string, number>) {
  await prisma.invoice.deleteMany();
  return prisma.invoice.createMany({
    data: invoices.map((invoice) => ({
      amount: invoice.amount,
      status: invoice.status as 'pending' | 'paid',
      date: new Date(invoice.date),
      customerId: customerIdMap[invoice.customer_id],
    })),
  });
}

async function seedRevenue() {
  return Promise.all(
    revenue.map((rev) =>
      prisma.revenue.upsert({
        where: { month: rev.month },
        update: { revenue: rev.revenue },
        create: { month: rev.month, revenue: rev.revenue },
      }),
    ),
  );
}

export async function GET() {
  try {
    await seedUsers();
    const seededCustomers = await seedCustomers();

    // Map placeholder UUID → Prisma auto-increment Int id
    const customerIdMap: Record<string, number> = {};
    customers.forEach((c, i) => {
      customerIdMap[c.id] = seededCustomers[i].id;
    });

    await seedInvoices(customerIdMap);
    await seedRevenue();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
