"use client";

import { Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { updateStatusAction } from "@/actions/actions";

import { Badge } from "@/components/ui/badge";
import Container from "@/components/Container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useOptimistic } from "react";

interface InvoiceProps {
  invoice: typeof Invoices.$inferSelect;
}

const Invoice = ({ invoice }: InvoiceProps) => {
  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (state, newStatus) => {
      return String(newStatus);
    },
  );

  async function handleOnUpdateStatus(formData: FormData) {
    const originalStatus = currentStatus;
    setCurrentStatus(formData.get("status"));

    try {
      await updateStatusAction(formData);
    } catch (e) {
      setCurrentStatus(originalStatus);
      console.log(e);
    }
  }

  return (
    <main className="w-full h-full">
      <Container>
        <div className="flex justify-between mb-8">
          <h1 className="flex items-center gap-4 text-3xl font-bold">
            Invoice {invoice.id}
            <Badge
              className={cn(
                "rounded-full capitalize",
                currentStatus === "open" && "bg-blue-500",
                currentStatus === "paid" && "bg-green-500",
                currentStatus === "void" && "bg-zinc-700",
                currentStatus === "uncollectible" && "bg-red-600",
              )}
            >
              {currentStatus}
            </Badge>
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2" variant="outline">
                Change Status <ChevronDown className="w-4 h-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {AVAILABLE_STATUSES.map((status) => {
                return (
                  <DropdownMenuItem key={status.id}>
                    <form action={handleOnUpdateStatus}>
                      <input type="hidden" name="id" value={invoice.id} />
                      <input type="hidden" name="status" value={status.id} />
                      <button>{status.label}</button>
                    </form>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>
        <p className="text-lg mb-8">{invoice.description}</p>

        <h2 className="font-bold text-lg mb-4">Billing Details</h2>

        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Id
            </strong>
            <span>{invoice.id}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            {/* <span>{new Date(invoice.createTs).toLocaleDateString()}</span> */}
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Name
            </strong>
            <span></span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Email
            </strong>
            <span></span>
          </li>
        </ul>
      </Container>
    </main>
  );
};

export default Invoice;
