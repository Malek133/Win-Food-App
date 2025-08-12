'use client'

import  { useState } from 'react'
import { Button } from './ui/button'
import { Check, Copy } from "lucide-react"

const UrlMaps = () => {
    const [copied, setCopied] = useState(false);
  

  const handleCopy = () => {
    
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }
  return (
    <Button variant="ghost" size="icon" className="size-5 cursor-pointer group/copy" onClick={handleCopy}>
                  {copied ? <Check className="size-3" /> : <Copy className="size-3 group-hover/copy:text-foreground" />}
                </Button>
  )
}

export default UrlMaps
