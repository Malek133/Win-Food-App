import {  Table,  TableBody,  TableCaption,  TableCell,  TableHead,  TableHeader,  TableRow,} 
from "@/components/ui/table";
import {  Dialog,  DialogContent,  DialogHeader, 
   DialogTitle,  DialogTrigger,} from "@/components/ui/dialog";
   import { Button } from "./ui/button";
   import { Pencil } from "lucide-react";
   import { getTodos } from "@/lib/actions/todo-action";
   import UserForm from "./user-form";
   import DeleteUserButton from "./delete-button-todo";
   
   export default async function UsersTable() {  
    const todos = await getTodos();  
    return (    
    <Table>      
      <TableCaption>A list users.</TableCaption>     
       <TableHeader>        
        <TableRow>          
          <TableHead className="w-[100px]">Title</TableHead>          
          <TableHead>Created At</TableHead>          
          <TableHead className="text-right">Actions</TableHead>       
           </TableRow>      
           </TableHeader>      
           <TableBody>        
            {todos.map((todo) => (          
              <TableRow key={todo.id}>            
                <TableCell>{todo.title}</TableCell>            
                <TableCell>{todo.createdAt?.toLocaleString()}</TableCell>           
                 <TableCell className="text-right">            
                    <Dialog>                
                      <DialogTrigger asChild>                  
                        <Button variant="ghost">                   
                           <Pencil className="size-4" />                  
                           </Button>                
                           </DialogTrigger>                
                           <DialogContent>                 
                             <DialogHeader>                
                          <DialogTitle>Edit Todo</DialogTitle>                     
                           <UserForm todo={todo} />                    
                           </DialogHeader>                
                           </DialogContent>              
                           </Dialog>              
                           <DeleteUserButton userId={todo.id!} />                      
                             </TableCell>          
                             </TableRow>       
                              ))}      
                              </TableBody>    
                              </Table>  );
                              }