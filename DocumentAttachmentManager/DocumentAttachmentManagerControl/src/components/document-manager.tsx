'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Eye } from 'lucide-react';
import { Button } from './elements/button';
import { Card, CardContent } from './elements/card';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './elements/dialog';
import { Input } from './elements/input';
import React from 'react';
import { ImageViewer } from './image-viewer';
import { DocumentList } from './document-list';
import { useDispatch, useSelector } from 'react-redux';
import { useGetNotesQuery } from '../store/api/notes-api-slice';
import { setContext } from '../store/app/context-slice';
import type { IInputs } from '../../generated/ManifestTypes';
import type { AppDispatch, RootState } from '../store';

export interface Document {
  name: string;
  type: string;
  url: string;
}

interface IDocumentManagerProps {
  context: ComponentFramework.Context<IInputs>;
}

export default function DocumentManager({ context }: IDocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filter, setFilter] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const ctx = useSelector((state: RootState) => state.pcfApi.context);
  const { data: notes, isLoading } = useGetNotesQuery();

  useEffect(() => {
    dispatch(setContext(context));
  }, [dispatch, context]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newDocuments = acceptedFiles.map(file => ({
      name: file.name,
      type: file.type,
      base64: file.arrayBuffer(),
      url: URL.createObjectURL(file),
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const downloadDocument = (doc: Document) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
