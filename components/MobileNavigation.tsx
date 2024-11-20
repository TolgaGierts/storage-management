'use client';

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { navItems } from './constants';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import FileUploader from './FileUploader';
import { signOut } from '@/lib/actions/user.actions';

type User = {
  fullName: string;
  email: string;
  avatar: string;
  ownerId: string;
  accountId: string;
};

const MobileNavigation = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  return (
    <header className="mobile-header">
      <Image
        src="assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Image
            src="assets/icons/menu.svg"
            alt="menu"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <div className="header-user">
              <Image
                src={user.avatar}
                alt="user"
                width={44}
                height={44}
                className="header-user-avatar"
              />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{user.fullName}</p>
                <p className="caption">{user.email}</p>
              </div>
            </div>
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map((item) => {
                const active = pathname === item.url;
                return (
                  <Link href={item.url} key={item.name} className="lg:w-full">
                    <li
                      className={cn('mobile-nav-item', active && 'shad-active')}
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={24}
                        height={24}
                        className={cn(
                          'nav-icon',
                          pathname === item.url && 'nav-icon-active'
                        )}
                      />
                      <p>{item.name}</p>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </nav>

          <Separator className="my-5 bg-light-200/20" />
          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader ownerId={user.ownerId} accountId={user.accountId} />
            <Button type="submit" className="mobile-sign-out-button" onClick={async ()=> await signOut()}>
              <Image
                src="assets/icons/logout.svg"
                alt="logo"
                width={24}
                height={24}
              />
              <p>Sign Out</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
