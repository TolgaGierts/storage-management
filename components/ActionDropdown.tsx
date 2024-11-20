'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { constructDownloadUrl } from '@/lib/utils';
import { ActionType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Models } from 'node-appwrite';
import React, { useState } from 'react';
import { actionsDropdownItems } from './constants';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { deleteFile, renameFile, updateFileUsers } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';
import { FileDetails, ShareInput } from './ActionsModalContent';

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();
  const [emails, setEmails] = useState<string[]>([]);


  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    // setEmails([]);
  };

  const handleAction = async () => {
    if (!action) return;

    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () => renameFile({fileId: file.$id, name, extension: file.extension, path}),
      share: () => updateFileUsers({fileId: file.$id, emails, path}),
      delete: () => deleteFile({fileId: file.$id, bucketFileId: file.bucketFileId, path})
    }

    success = await actions[action.value as keyof typeof actions]();
    if(success) {
      closeAllModals();
      setIsLoading(false);
    }
  }

  const handleRemoveUser = async (email:string) => {
    const updatedEmails = emails.filter(e => e !== email);

    const success = await updateFileUsers({fileId: file.$id, emails: updatedEmails, path});
    if(success) {
      setEmails(updatedEmails);
    }
    closeAllModals();
  }

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;
    return (
      <DialogContent className='shad-dialog button'>
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === 'rename' && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === 'details' && (
            <FileDetails file={file} />
          )}

          {value === 'share' && (
            <ShareInput file={file} onInputChange={setEmails} onRemove={handleRemoveUser}/>
          )}

          {value === 'delete' && (
            <p className='delete-confirmation'>Are you sure you want to delete this file?</p>
          )}


        </DialogHeader>
        {[
          'rename',
          'share',
          'delete',
        ].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button variant="outline" className="modal-cancel-button" onClick={closeAllModals}>
              Cancel
            </Button>
            <Button className="modal-submit-button" onClick={handleAction}>
              <p className='capitalize'>{value}</p>
              {isLoading && (
                <Image
                  src={'/assets/icons/loader.svg'}
                  alt="loader"
                  width={24}
                  height={24}
                  className='animate-spin'
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src={'/assets/icons/dots.svg'}
            alt="more-options"
            width={32}
            height={32}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => {
                setAction(item);
                if (
                  ['rename', 'share', 'delete', 'details'].includes(item.value)
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {item.value === 'download' ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  className="flex items-center gap-2"
                  download={file.name}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={34}
                    height={34}
                  />
                  {item.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={34}
                    height={34}
                  />
                  {item.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
