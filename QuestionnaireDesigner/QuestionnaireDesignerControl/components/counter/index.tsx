// import * as React from 'react';
// import type { AppDispatch, RootState } from '../../store';
// import { useDispatch, useSelector } from 'react-redux';
// import { decrement, incrementAsync } from '../../store/app-states/counter-slice';
// // import { useCreatePostMutation, useGetPostsQuery } from '../../store/api-states/getProductApiSlice';
// import type { IInputs } from '../../generated/ManifestTypes';
// import { setContext } from '../../store/app-states/pcf-context-slice';

// interface IProps {
//   context: ComponentFramework.Context<IInputs>;
// }

// export const Counter = ({ context }: IProps) => {
//   const count = useSelector((state: RootState) => state.counter.value);
//   const dispatch = useDispatch<AppDispatch>();
//   // const { data: post, isLoading, isError } = useGetPostsQuery({ limit: 1, offset: 0 }); // without using useEffect, this will trigger a request on every render
//   // const [createPostMutation, { isLoading: isCreating, isError: isCreateError }] = useCreatePostMutation();

//   React.useEffect(() => {
//     dispatch(setContext(context)); // Replace with your actual context data
//   }, [dispatch]);

//   return (
//     <div>
//       <h2>{count}</h2>
//       <div>
//         <button onClick={() => dispatch(incrementAsync(10))}>Increment</button>
//         <button onClick={() => dispatch(decrement())}>Decrement</button>
//       </div>
//     </div>
//   );
// };
