import {
  type ColumnMetadata,
  type TableMetadata,
  mockMetadata,
} from "@utils/settings/data/mock-data";
import { baseApi } from "../api";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getMetadata: builder.query<TableMetadata[], void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { data: mockMetadata };
      },
    }),
    getColumnsByLevel: builder.query<ColumnMetadata[], string>({
      queryFn: async (level: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const allColumns = mockMetadata.flatMap(table => table.columns);
        const filteredColumns = allColumns.filter(col => col.level === level);
        return { data: filteredColumns };
      },
    }),
  }),
});

export const { useGetMetadataQuery, useGetColumnsByLevelQuery } = categoryApi;
