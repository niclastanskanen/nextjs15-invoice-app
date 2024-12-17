import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";

import Invoice from "./Invoice";

const InvoiceIdPage = async ({ params }: { params: { invoiceId: string } }) => {
  const { userId } = await auth();

  if (!userId) return;

  const { invoiceId: invoiceIdParam } = await params;
  const invoiceId = parseInt(invoiceIdParam);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }

  const [result] = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)));

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  };

  return <Invoice invoice={invoice} />;
};

export default InvoiceIdPage;
