import fetchCustomers from '@/app/lib/data';
import Image from 'next/image';

export default async function CustomersTable() {
  const customers = await fetchCustomers();
  return (    
    <div className="w-full">
      <h1 className={`mb-8 text-xl md:text-2xl`}>
        Customers
      </h1>

      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              {/* Mobile cards */}
              <div className="md:hidden">
                <div className="mb-2 w-full rounded-md bg-white p-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <div className="flex items-center gap-3">
                          <Image
                            src="/customers/default-avatar.png"
                            className="rounded-full"
                            alt="John Doe's profile picture"
                            width={28}
                            height={28}
                          />
                          <p>John Doe</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        john.doe@example.com
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between border-b py-5">
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Pending</p>
                      <p className="font-medium">$500.00</p>
                    </div>
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Paid</p>
                      <p className="font-medium">$1,200.00</p>
                    </div>
                  </div>
                  <div className="pt-4 text-sm">
                    <p>5 invoices</p>
                  </div>
                </div>
              </div>

              {/* Desktop table */}
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Invoices
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Pending
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Total Paid
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {
                    customers.map((cus) => {
                      return (
                        <tr className="group" key={cus.id}>
                          <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                            <div className="flex items-center gap-3">
                              <Image
                                src={cus.image_url}
                                className="rounded-full"
                                alt={cus.name}
                                width={28}
                                height={28}
                              />
                              <p>{cus.name}</p>
                            </div>
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {cus.email}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            5
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            $500.00
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                            $1,200.00
                          </td>
                        </tr>
                      )
                    })
                  }
                  
                  {/* add more static rows here if you want */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}