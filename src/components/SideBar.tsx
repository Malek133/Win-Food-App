import React from 'react'
import { BarChart2, CreditCard,
   Layout, Settings, Users } from "lucide-react";
import { Button } from './ui/button';
import Link from 'next/link';

const SideBar = () => {
return (
    <div id="sidebar" className="w-[300px] border-r border-dashed hidden md:block">
      <div className="flex flex-col divide-y border-b border-dashed">
        <Button variant="ghost" className="border-dashed h-14 text-left justify-start pl-8" asChild>
          <Link href="/dashboard">
            <Layout />
            <span>Dashboard</span>
          </Link>
        </Button>
        
        <Button variant="ghost" className="border-dashed h-14 text-left justify-start pl-8 opacity-50 cursor-not-allowed" disabled asChild>
          <Link href="/allfood">
            <Users />
            <span>All Food</span>
          </Link>
        </Button>
        <Button variant="ghost" className="border-dashed h-14 text-left justify-start pl-8 opacity-50 cursor-not-allowed" disabled asChild>
          <Link href="/Galleries">
            <CreditCard />
            <span>galleries</span>
          </Link>
        </Button>
        

        <Button variant="ghost" className="border-dashed h-14 text-left justify-start pl-8 opacity-50 cursor-not-allowed" disabled asChild>
          <Link href="/Posts">
            <CreditCard />
            <span>Posts</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default SideBar


