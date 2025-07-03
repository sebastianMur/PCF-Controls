import {
  Button,
  MessageBar,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  tokens,
} from '@fluentui/react-components';
import { Add20Regular, AddCircle20Regular, ChevronDown20Regular, ChevronRight20Regular, Delete20Regular } from '@fluentui/react-icons';
import { useGetMetadataQuery } from '@utils/store/endpoints/category-api';
import { useTemplateBuilderStyles } from '@utils/styles/template-builder-styles';
import type TemplateData from '@utils/types/utility-types';
import type { Category, LineItem, Subcategory, TemplateColumn } from '@utils/types/utility-types';
import type React from 'react';
import { useEffect, useState } from 'react';
import AddItemModal from './add-item-modal';
import ColumnSelectionModal from './column-selection-modal';
import DragIndicator from './drag-indicator';
import DropZoneIndicator from './drop-zone-indicator';

interface TemplateBuilderProps {
  templateData: TemplateData;
  onTemplateChange: (data: TemplateData) => void;
}

export default function TemplateBuilder({ templateData, onTemplateChange }: TemplateBuilderProps) {
  const [localData, setLocalData] = useState<TemplateData>(templateData);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [addItemType, setAddItemType] = useState<'category' | 'subcategory' | 'lineitem'>('category');
  const [addItemParent, setAddItemParent] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const { data: _metadata, error, isLoading } = useGetMetadataQuery();
  const styles = useTemplateBuilderStyles();

  useEffect(() => {
    setLocalData(templateData);
  }, [templateData]);

  useEffect(() => {
    onTemplateChange(localData);
  }, [localData, onTemplateChange]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

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

  const addColumn = (column: TemplateColumn) => {
    setLocalData(prev => ({
      ...prev,
      columns: [...prev.columns, column],
    }));
    setIsColumnModalOpen(false);
  };

  const removeColumn = (columnId: string) => {
    if (columnId === 'item') return;

    setLocalData(prev => ({
      ...prev,
      columns: prev.columns.filter(col => col.id !== columnId),
    }));
  };

  const openAddItemModal = (type: 'category' | 'subcategory' | 'lineitem', parent?: { id: string; name: string }) => {
    setAddItemType(type);
    setAddItemParent(parent || null);
    setIsAddItemModalOpen(true);
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const addCategory = (data: any) => {
    const newCategory: Category = {
      id: generateId(),
      categoryId: `CAT${String(localData.template.categories.length + 1).padStart(3, '0')}`,
      name: data.name,
      templateId: localData.template.templateId,
      description: data.description,
      budget: data.budget,
      total: 0,
      subcategories: [],
      isExpanded: true,
    };

    setLocalData(prev => ({
      ...prev,
      template: {
        ...prev.template,
        categories: [...prev.template.categories, newCategory],
      },
    }));
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const addSubcategory = (categoryId: string, data: any) => {
    const newSubcategory: Subcategory = {
      id: generateId(),
      subCategoryId: `SUB${String(Date.now()).slice(-3)}`,
      name: data.name,
      categoryId: categoryId,
      code: data.code,
      gfcmId: data.gfcmId,
      total: 0,
      lineItems: [],
      isExpanded: true,
    };

    setLocalData(prev => ({
      ...prev,
      template: {
        ...prev.template,
        categories: prev.template.categories.map(cat =>
          cat.categoryId === categoryId ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] } : cat,
        ),
      },
    }));
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const addLineItem = (subcategoryId: string, data: any) => {
    const newLineItem: LineItem = {
      id: generateId(),
      lineItemId: `ITEM${String(Date.now()).slice(-3)}`,
      name: data.name,
      unitPrice: data.unitPrice,
      unit: data.unit,
      quantity: 0,
      total: 0,
      subCategoryId: subcategoryId,
    };

    setLocalData(prev => ({
      ...prev,
      template: {
        ...prev.template,
        categories: prev.template.categories.map(cat => ({
          ...cat,
          subcategories: cat.subcategories.map(sub =>
            sub.subCategoryId === subcategoryId ? { ...sub, lineItems: [...sub.lineItems, newLineItem] } : sub,
          ),
        })),
      },
    }));
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleAddItem = (data: any) => {
    if (addItemType === 'category') {
      addCategory(data);
    } else if (addItemType === 'subcategory' && addItemParent) {
      addSubcategory(addItemParent.id, data);
    } else if (addItemType === 'lineitem' && addItemParent) {
      addLineItem(addItemParent.id, data);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    if (columnId === 'item') return;
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== columnId) {
      setDragOverColumn(columnId);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!draggedColumn || draggedColumn === targetColumnId) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    const draggedIndex = localData.columns.findIndex(col => col.id === draggedColumn);
    const targetIndex = localData.columns.findIndex(col => col.id === targetColumnId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newColumns = [...localData.columns];
    const [draggedCol] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedCol);

    setLocalData(prev => ({
      ...prev,
      columns: newColumns,
    }));

    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
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

  const getColumnHeaderClassName = (column: TemplateColumn) => {
    let className = styles.columnHeader;
    if (dragOverColumn === column.id) {
      className += ` ${styles.columnHeaderDragOver}`;
    }
    if (draggedColumn === column.id) {
      className += ` ${styles.columnHeaderDragging}`;
    }
    return className;
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
            <Button
              appearance='subtle'
              size='small'
              icon={<AddCircle20Regular />}
              onClick={() =>
                openAddItemModal('subcategory', {
                  id: category.categoryId,
                  name: category.name,
                })
              }
              style={{ color: tokens.colorNeutralForegroundOnBrand }}
              title='Add Subcategory'
            />
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
                <Button
                  appearance='subtle'
                  size='small'
                  icon={<AddCircle20Regular />}
                  onClick={() =>
                    openAddItemModal('lineitem', {
                      id: subcategory.subCategoryId,
                      name: subcategory.name,
                    })
                  }
                  style={{ color: tokens.colorNeutralForeground1 }}
                  title='Add Line Item'
                />
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
                      <Text>{renderCellValue(lineItem, column)}</Text>
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

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size='large' label='Loading metadata...' />
      </div>
    );
  }

  if (error) {
    return <MessageBar intent='error'>Failed to load metadata. Please try again.</MessageBar>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Text className={styles.title}>Template Design</Text>
          <Text className={styles.subtitle}>
            Design your template structure by adding categories, subcategories, line items, and columns.
          </Text>
        </div>
        <Button appearance='primary' icon={<Add20Regular />} onClick={() => openAddItemModal('category')}>
          Add Category
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <Table arial-label='Template configuration table'>
            <TableHeader>
              <TableRow>
                <TableHeaderCell className={styles.columnHeader}>
                  <div className={styles.itemHeaderCell}>
                    <Text>Item</Text>
                    <Button
                      appearance='subtle'
                      size='small'
                      icon={<Add20Regular />}
                      onClick={() => setIsColumnModalOpen(true)}
                      aria-label='Add column'
                    />
                  </div>
                </TableHeaderCell>
                {localData.columns.slice(1).map(column => (
                  <TableHeaderCell
                    key={column.id}
                    className={getColumnHeaderClassName(column)}
                    draggable={true}
                    onDragStart={e => handleDragStart(e, column.id)}
                    onDragOver={e => handleDragOver(e, column.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={e => handleDrop(e, column.id)}
                    onDragEnd={handleDragEnd}
                    style={{
                      cursor: draggedColumn ? 'grabbing' : 'grab',
                    }}
                  >
                    <DropZoneIndicator isActive={dragOverColumn === column.id && draggedColumn !== null} position='left' />
                    <div className={styles.columnHeaderContent}>
                      <div className={styles.columnHeaderLeft}>
                        <DragIndicator isDragging={draggedColumn === column.id} isDropTarget={dragOverColumn === column.id} />
                        <Text>{column.displayName}</Text>
                      </div>
                      <Button
                        appearance='subtle'
                        size='small'
                        icon={<Delete20Regular />}
                        onClick={() => removeColumn(column.id)}
                        aria-label={`Remove ${column.displayName} column`}
                      />
                    </div>
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>
        </div>
      </div>

      <ColumnSelectionModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onAddColumn={addColumn}
        existingColumns={localData.columns}
      />

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onAdd={handleAddItem}
        type={addItemType}
        parentName={addItemParent?.name}
      />
    </div>
  );
}
