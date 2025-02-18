import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setContext } from '../store/app/context-slice';
import { useGetNotesQuery } from '../store/api/notes-api-slice';
import type { AppDispatch, RootState } from '../store';
import { IInputs } from '../../generated/ManifestTypes';

interface ICustomComponent {
  context: ComponentFramework.Context<IInputs>;
}

const CustomComponent = ({ context }: ICustomComponent) => {
  const dispatch = useDispatch<AppDispatch>();
  const ctx = useSelector((state: RootState) => state.pcfApi.context);
  const { data: notes, isLoading } = useGetNotesQuery();

  React.useEffect(() => {
    dispatch(setContext(context));
  }, [dispatch, context]);

  if (!ctx || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes?.map(note => (
          <li key={note.annotationid}>{note.filename}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomComponent;

