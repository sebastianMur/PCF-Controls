import React from 'react';
import type { FC } from 'react';
import { Button } from '../elements/button';
import { Alert, AlertDescription, AlertTitle } from '../elements/alert';
import { DialogContent, DialogTitle, DialogFooter, DialogHeader, DialogDescription } from '../elements/dialog';
import { AlertCircle } from 'lucide-react';
import { v4 as uuid } from 'uuid';
interface DuplicateDialogProps {
  duplicates: Array<{ name: string; file: File }>;
  onConfirm: () => void;
  onCancel: () => void;
}
export const DuplicateDialog: FC<DuplicateDialogProps> = ({ duplicates, onCancel, onConfirm }) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Duplicate Files Detected</DialogTitle>
        <DialogDescription>The following files already exist and will be replaced:</DialogDescription>
      </DialogHeader>
      <Alert>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Confirmation Required</AlertTitle>
        <AlertDescription>
          <ul className='list-disc pl-4'>
            {duplicates.map(item => (
              <li key={uuid()}>{item.name}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
      <DialogFooter className='gap-2 sm:gap-0'>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Replace Files</Button>
      </DialogFooter>
    </DialogContent>
  );
};
