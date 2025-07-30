import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type TemplateFormData, templateFormSchema } from "./form-schemas";

const useGetDefaultValues = () => {
  //* ───── RTK Query ─────
  // const templateId = useAppSelector(selectTemplateId);
  // const wpnId = useAppSelector(selectWPNId);

  // get template summary with template information
  // const [
  //   getTemplateFormData,
  //   { data: questionnaires, isLoading: isLoadingQuestionnaires },
  // ] = useLazyGetTemplateCompletionDataQuery();

  // Get Cateogory summary with Category information

  // Get Subcategoy summary with subcateogory information

  // Get Line Item Details with line item information

  const getInitialTemplateValues = async (): Promise<TemplateFormData> => {
    const defaultValues: Partial<TemplateFormData> = {};

    // defaultValue = {
    //   templateSummary: {
    //     templateId: "",
    //     grandTotal: 0,
    //   },
    //   categories: [{}],
    //   subcategories: [{}],
    //   lineItems: [{}],
    //   attachment: {},
    // } as TemplateFormData;

    return defaultValues as TemplateFormData;
  };

  return {
    getInitialTemplateValues,
  };
};

export const useTemplateCompletionForm = () => {
  const { getInitialTemplateValues } = useGetDefaultValues();

  return useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    shouldUnregister: false, // crucial for multi-step
    mode: "onChange",
    defaultValues: async () => await getInitialTemplateValues(),
  });
};
