import React from 'react';
import { ScrollArea } from '../elements/scroll-area';
import { X, Download, Eye } from 'lucide-react';
import { Button } from '../elements/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '../elements/dialog';
import { ImageViewer } from './image-viewer';
import type { IDocument } from '../../types/document-manager';
import type { INote } from '../../types/note';

interface IDocumentListProps {
  documents: IDocument[];
  filteredDocuments: IDocument[];
  removeDocument: (index: number) => void;
  downloadDocument: (doc: IDocument) => void;
  notes: INote[];
}

export const DocumentList = ({ notes, documents, filteredDocuments, removeDocument, downloadDocument }: IDocumentListProps) => {
  console.log('🚀 ~ DocumentList ~ notes:', notes);
  return (
    <ScrollArea className='h-[fit-content] w-full rounded-md border p-4'>
      {filteredDocuments.map((doc, index) => (
        <div key={doc.url} className='flex items-center justify-between py-2 border-b last:border-b-0'>
          <span className='truncate max-w-[40%]'>{doc.name}</span>
          <div className='flex space-x-2'>
            <Button variant='outline' size='sm' onClick={() => downloadDocument(doc)}>
              <Download className='h-4 w-4 mr-1' />
              Download
            </Button>
            {doc.type.startsWith('image/') && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='outline' size='sm'>
                    <Eye className='h-4 w-4 mr-1' />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className='max-w-[90vw] w-full max-h-[90vh] p-6'>
                  <DialogTitle className='sr-only'>Image Viewer</DialogTitle>
                  <ImageViewer documents={documents} />
                </DialogContent>
              </Dialog>
            )}
            <Button variant='ghost' size='sm' onClick={() => removeDocument(index)}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};
