import {
  Button,
  Input,
  MessageBar,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  tokens,
} from '@fluentui/react-components';
import { ChevronDown20Regular, ChevronRight20Regular, Save20Regular } from '@fluentui/react-icons';
import { useTemplateCompletionStyles } from '@utils/styles/template-completion';
import type TemplateData from '@utils/types/utility-types';
import type { Category, LineItem, Subcategory, TemplateColumn } from '@utils/types/utility-types';
import type React from 'react';
import { useEffect, useState } from 'react';

interface TemplateCompletionProps {
  templateData: TemplateData;
  onTemplateChange: (data: TemplateData) => void;
}

export default function TemplateCompletion({ templateData, onTemplateChange }: TemplateCompletionProps) {
  const [localData, setLocalData] = useState<TemplateData>(templateData);
  const [hasChanges, setHasChanges] = useState(false);
  const styles = useTemplateCompletionStyles();

  useEffect(() => {
    setLocalData(templateData);
  }, [templateData]);

  const toggleCategoryExpansion = (categoryId: string) => {
    setLocalData(prev => ({
      ...prev,
      template: {
        ...prev.template,
        categories: prev.template.categories.map(cat => (cat.id === categoryId ? { ...cat, isExpanded: !cat.isExpanded } : cat)),
      },
    }));
  };

  const toggleSubcategoryExpansion = (categoryId: string, subcategoryId: string) => {
    setLocalData(prev => ({
      ...prev,
      template: {
        ...prev.template,
        categories: prev.template.categories.map(cat =>
          cat.id === categoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.map(sub => (sub.id === subcategoryId ? { ...sub, isExpanded: !sub.isExpanded } : sub)),
              }
            : cat,
        ),
      },
    }));
  };

  const updateLineItemQuantity = (lineItemId: string, quantity: number) => {
    setLocalData(prev => {
      const newData = {
        ...prev,
        template: {
          ...prev.template,
          categories: prev.template.categories.map(cat => ({
            ...cat,
            subcategories: cat.subcategories.map(sub => ({
              ...sub,
              lineItems: sub.lineItems.map(item =>
                item.id === lineItemId
                  ? {
                      ...item,
                      quantity,
                      total: (item.unitPrice || 0) * quantity,
                    }
                  : item,
              ),
            })),
          })),
        },
      };

      return calculateTotals(newData);
    });
    setHasChanges(true);
  };

  const calculateTotals = (data: TemplateData): TemplateData => {
    return {
      ...data,
      template: {
        ...data.template,
        categories: data.template.categories.map(cat => {
          const updatedSubcategories = cat.subcategories.map(sub => {
            const subcategoryTotal = sub.lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
            return {
              ...sub,
              total: subcategoryTotal,
            };
          });

          const categoryTotal = updatedSubcategories.reduce((sum, sub) => sum + (sub.total || 0), 0);

          return {
            ...cat,
            subcategories: updatedSubcategories,
            total: categoryTotal,
          };
        }),
      },
    };
  };

  const saveChanges = () => {
    onTemplateChange(localData);
    setHasChanges(false);
  };

  const renderCellValue = (item: Category | Subcategory | LineItem, column: TemplateColumn) => {
    const value = item[column.name] || item[column.id];

    if (column.type === 'currency' && typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    if (column.type === 'number' && typeof value === 'number') {
      return value.toString();
    }
    return value?.toString() || '-';
  };

  const renderEditableCell = (item: LineItem, column: TemplateColumn) => {
    if (column.name === 'quantity') {
      return (
        <Input
          type='number'
          value={item.quantity?.toString() || '0'}
          onChange={(_e, data) => {
            const quantity = Number.parseInt(data.value) || 0;
            updateLineItemQuantity(item.id, quantity);
          }}
          className={styles.quantityInput}
          min='0'
        />
      );
    }
    return <Text>{renderCellValue(item, column)}</Text>;
  };

  const renderTableRows = () => {
    const rows: React.ReactNode[] = [];

    for (const category of localData.template.categories) {
      // Category row
      rows.push(
        <TableRow key={category.id} className={styles.categoryRow}>
          <TableCell className={styles.categoryCell}>
            <Button
              appearance='subtle'
              size='small'
              icon={category.isExpanded ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
              onClick={() => toggleCategoryExpansion(category.id)}
              style={{ color: tokens.colorNeutralForegroundOnBrand }}
            />
            <Text>{category.name}</Text>
          </TableCell>
          {localData.columns.slice(1).map(column => (
            <TableCell
              key={column.id}
              style={{
                color: tokens.colorNeutralForegroundOnBrand,
                fontWeight: tokens.fontWeightBold,
              }}
            >
              <Text>{renderCellValue(category, column)}</Text>
            </TableCell>
          ))}
        </TableRow>,
      );

      if (category.isExpanded) {
        for (const subcategory of category.subcategories) {
          // Subcategory row
          rows.push(
            <TableRow key={subcategory.id} className={styles.subcategoryRow}>
              <TableCell className={styles.subcategoryCell}>
                <Button
                  appearance='subtle'
                  size='small'
                  icon={subcategory.isExpanded ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
                  onClick={() => toggleSubcategoryExpansion(category.id, subcategory.id)}
                  style={{ color: tokens.colorNeutralForeground1 }}
                />
                <Text>{subcategory.name}</Text>
              </TableCell>
              {localData.columns.slice(1).map(column => (
                <TableCell
                  key={column.id}
                  style={{
                    color: tokens.colorNeutralForeground1,
                    fontWeight: tokens.fontWeightSemibold,
                  }}
                >
                  <Text>{column.name === 'gfcm' ? subcategory.gfcmId : renderCellValue(subcategory, column)}</Text>
                </TableCell>
              ))}
            </TableRow>,
          );

          if (subcategory.isExpanded) {
            for (const lineItem of subcategory.lineItems) {
              rows.push(
                <TableRow key={lineItem.id} className={styles.lineItemRow}>
                  <TableCell className={styles.lineItemCell}>
                    <Text>{lineItem.name}</Text>
                  </TableCell>
                  {localData.columns.slice(1).map(column => (
                    <TableCell key={column.id} style={{ color: tokens.colorNeutralForeground1 }}>
                      {renderEditableCell(lineItem, column)}
                    </TableCell>
                  ))}
                </TableRow>,
              );
            }
          }
        }
      }
    }

    return rows;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Text className={styles.title}>Execute EFE Categories</Text>
          <Text className={styles.subtitle}>Fill in quantities to calculate totals. Only quantity fields are editable.</Text>
        </div>
        {hasChanges && (
          <Button appearance='primary' icon={<Save20Regular />} onClick={saveChanges}>
            Save Changes
          </Button>
        )}
      </div>

      {hasChanges && <MessageBar intent='info'>You have unsaved changes. Click "Save Changes" to apply them to the template.</MessageBar>}

      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <Table arial-label='Template completion table'>
            <TableHeader>
              <TableRow>
                <TableHeaderCell className={styles.columnHeader}>
                  <Text>Item</Text>
                </TableHeaderCell>
                {localData.columns.slice(1).map(column => (
                  <TableHeaderCell key={column.id} className={styles.columnHeader}>
                    <Text>{column.displayName}</Text>
                    {column.name === 'quantity' && <Text className={styles.editableIndicator}>*</Text>}
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>
        </div>
      </div>

      <Text className={styles.footerNote}>* Editable fields - modify quantities to automatically calculate totals</Text>
    </div>
  );
}
