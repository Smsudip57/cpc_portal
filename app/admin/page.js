'use client';
import React from 'react'
import Navbar from '@/components/navbar'
import AdminSideBar from '@/components/adminSidebar'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  router.push('/admin/publishnews')
  return (
    <div>
    </div>
  )
}
