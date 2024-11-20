'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { navItems } from './constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type User = {
  fullName: string;
  email: string;
  avatar: string;
}


const Sidebar = ({user}: {user: User}) => {

  const pathname = usePathname();
 

  return (
    <aside className='sidebar'>
        <Link href='/'>
          <Image src='assets/icons/logo-full-brand.svg' alt='logo' width={160} height={50} className='hidden h-auto lg:block'/>
          <Image src='assets/icons/logo-brand.svg' alt='logo' width={52} height={52} className='h-auto lg:hidden'/>
        </Link>

        <nav className='sidebar-nav'>
          <ul className='flex flex-1 flex-col gap-6'>
            {navItems.map((item) => {
              const active = pathname === item.url;
              return (
                <Link href={item.url} key={item.name} className='lg:w-full '>
                  <li className={cn('sidebar-nav-item', active && 'shad-active')}>
                    <Image src={item.icon} alt={item.name} width={24} height={24} className={cn('nav-icon', pathname === item.url && 'nav-icon-active')}/>
                    <p className="hidden lg:block">{item.name}</p>
                  </li>
                </Link>
              )
            })}
          </ul>
        </nav>
        <Image src='/assets/images/files-2.png' alt='logo' width={506} height={408} className='w-full'/>
        <div className='sidebar-user-info'>
          <Image src={user.avatar} alt='avatar' width={44} height={44} className='sidebar-user-avatar'/>
          <div className='hidden lg:block'>
            <p className='subtitle-2 capitalize'>{user?.fullName}</p>
            <p className='body-small text-gray-500'>{user?.email}</p>
          </div>
        </div>
    </aside>
  )
}

export default Sidebar
