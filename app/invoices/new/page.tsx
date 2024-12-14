"use client";

import { startTransition, SyntheticEvent, useState } from "react";
import Form from "next/form";

import { createInvoice } from "@/actions/actions";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/SubmitButton";
import Container from "@/components/Container";

const NewInvoicePage = () => {
  const [state, setState] = useState("ready");

  async function handleOnSubmit(event: SyntheticEvent) {
    if (state === "pending") {
      event.preventDefault();
      return;
    }
    setState("pending");
  }

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Invoices</h1>
        </div>
        <Form
          action={createInvoice}
          onSubmit={handleOnSubmit}
          className="grid gap-4 max-w-xs"
        >
          <div>
            <Label htmlFor="name" className="block text-sm font-semibold mb-2">
              Billing Name
            </Label>
            <Input name="name" id="name" type="text" />
          </div>
          <div>
            <Label htmlFor="email" className="block text-sm font-semibold mb-2">
              Billing Email
            </Label>
            <Input name="email" id="email" type="email" />
          </div>
          <div>
            <Label htmlFor="value" className="block text-sm font-semibold mb-2">
              Value
            </Label>
            <Input name="value" id="value" type="text" />
          </div>
          <div>
            <Label
              htmlFor="description"
              className="block text-sm font-semibold mb-2"
            >
              Description
            </Label>
            <Textarea name="description" id="description"></Textarea>
          </div>
          <div>
            <SubmitButton />
          </div>
        </Form>
      </Container>
    </main>
  );
};

export default NewInvoicePage;
