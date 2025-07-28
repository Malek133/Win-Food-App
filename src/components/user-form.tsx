"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(2).max(50),
});

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
//  import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Todos } from "@/lib/db/schema";
import { createTodo, updateTodo } from "@/lib/actions/todo-action";


interface UserFormProps {
  todo?: Todos;
}

export default function UserForm({ todo }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: todo?.title || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const userData = {
        ...values,
      };

      if (todo) {
         await updateTodo(todo.id!, userData);
      
      } else {
        await createTodo(userData);
      }

      form.reset();

      //  toast.success(`User ${todo ? "updated" : "added"} successfully`);
      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    //   toast.error(`Failed to ${todo ? "update" : "add"} user`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Bruce Wayne" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            `${todo ? "Update" : "Add"} User`
          )}
        </Button>
      </form>
    </Form>
  );
}