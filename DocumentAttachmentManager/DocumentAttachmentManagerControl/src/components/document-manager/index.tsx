'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Eye } from 'lucide-react';
import { Button } from '../elements/button';
import { Card, CardContent } from '../elements/card';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '../elements/dialog';
import { Input } from '../elements/input';
import React from 'react';
import { ImageViewer } from './image-viewer';
import { DocumentList } from './document-list';
import { useDispatch, useSelector } from 'react-redux';
import { useGetNotesQuery } from '../../store/api/notes-api-slice';
import { setContext } from '../../store/app/context-slice';
import type { IInputs } from '../../../generated/ManifestTypes';
import type { AppDispatch, RootState } from '../../store';
import type { IDocument } from '../../types/document-manager';
import { useDocumentManager } from '@/hooks/document-manager-hook';

interface IDocumentManagerProps {
  context: ComponentFramework.Context<IInputs>;
}

export default function DocumentManager({ context }: IDocumentManagerProps) {
  const {
    isLoading,
    documents,
    notes,
    filter,
    ctx,
    isDragActive,
    setFilter,
    getRootProps,
    getInputProps,
    removeDocument,
    downloadDocument,
  } = useDocumentManager(context);

  if (!ctx || isLoading) {
    return <div>Loading...</div>;
  }

  console.log('🚀 ~ DocumentManager ~ notes:', notes);

  const filteredDocuments = documents.filter(doc => doc.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className='w-full'>
      <Card>
        <CardContent className='pt-6'>
          <div className='flex justify-between items-center mb-4'>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors flex-grow mr-4 ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
              }`}
            >
              <input {...getInputProps()} />
              <div className='flex items-center justify-center'>
                <Upload className='h-6 w-6 text-gray-400 mr-2' />
                <p className='text-sm text-gray-600'>Drag &apos;n&apos; drop or click to upload</p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Input
                type='text'
                placeholder='Filter documents...'
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className='w-48'
              />

              {filteredDocuments.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline'>
                      <Eye className='h-4 w-4 mr-2' />
                      View All
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-[90vw] w-full max-h-[90vh] p-6'>
                    <DialogTitle className='sr-only'>Image Viewer</DialogTitle>
                    <ImageViewer documents={documents} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {filteredDocuments.length > 0 ? (
            <DocumentList
              documents={documents}
              filteredDocuments={filteredDocuments}
              removeDocument={removeDocument}
              downloadDocument={downloadDocument}
            />
          ) : (
            <p className='text-center text-gray-500'>No documents uploaded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
