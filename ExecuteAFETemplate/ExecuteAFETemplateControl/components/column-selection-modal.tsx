import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Dropdown,
  Label,
  MessageBar,
  Option,
  Spinner,
} from "@fluentui/react-components";
import { useGetColumnsByLevelQuery } from "@utils/store/endpoints/category-api";
import type { TemplateColumn } from "@utils/types/utility-types";
import { useState } from "react";

interface ColumnSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColumn: (column: TemplateColumn) => void;
  existingColumns: TemplateColumn[];
}

const levelOptions = [
  { key: "category", text: "Category" },
  { key: "subcategory", text: "Subcategory" },
  { key: "lineitem", text: "Line Item" },
  { key: "combined", text: "Combined" },
];

export default function ColumnSelectionModal({
  isOpen,
  onClose,
  onAddColumn,
  existingColumns,
}: ColumnSelectionModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string>("");

  const {
    data: availableColumns,
    error,
    isLoading,
  } = useGetColumnsByLevelQuery(selectedLevel, {
    skip: !selectedLevel,
  });

  const handleLevelChange = (_event: any, data: any) => {
    setSelectedLevel(data.optionValue || "");
    setSelectedColumn(""); // Reset column selection when level changes
  };

  const handleColumnChange = (_event: any, data: any) => {
    setSelectedColumn(data.optionValue || "");
  };

  const handleAddColumn = () => {
    if (!selectedLevel || !selectedColumn || !availableColumns) return;

    const columnToAdd = availableColumns.find(col => col.id === selectedColumn);
    if (!columnToAdd) return;

    // Check if column already exists
    const columnExists = existingColumns.some(col => col.id === columnToAdd.id);
    if (columnExists) return;

    onAddColumn(columnToAdd);

    // Reset form
    setSelectedLevel("");
    setSelectedColumn("");
  };

  const handleClose = () => {
    setSelectedLevel("");
    setSelectedColumn("");
    onClose();
  };

  const filteredColumns =
    availableColumns?.filter(
      col => !existingColumns.some(existing => existing.id === col.id),
    ) || [];

  const selectedColumnData = filteredColumns.find(
    col => col.id === selectedColumn,
  );
  const canAddColumn = selectedLevel && selectedColumn && selectedColumnData;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(_event, data) => !data.open && handleClose()}
    >
      <DialogSurface>
        <DialogTitle>Add Column</DialogTitle>
        <DialogContent>
          <DialogBody>
            <div className="space-y-4">
              <div>
                <Label htmlFor="level-dropdown" required>
                  Select Level
                </Label>
                <Dropdown
                  id="level-dropdown"
                  placeholder="Choose a level..."
                  value={
                    levelOptions.find(opt => opt.key === selectedLevel)?.text ||
                    ""
                  }
                  onOptionSelect={handleLevelChange}
                  className="w-full"
                >
                  {levelOptions.map(option => (
                    <Option key={option.key} value={option.key}>
                      {option.text}
                    </Option>
                  ))}
                </Dropdown>
              </div>

              {selectedLevel && (
                <div>
                  <Label htmlFor="column-dropdown" required>
                    Select Column
                  </Label>
                  {isLoading ? (
                    <div className="flex items-center gap-2 p-2">
                      <Spinner size="tiny" />
                      <span>Loading columns...</span>
                    </div>
                  ) : error ? (
                    <MessageBar intent="error">
                      Failed to load columns for this level.
                    </MessageBar>
                  ) : filteredColumns.length === 0 ? (
                    <MessageBar intent="info">
                      No available columns for this level or all columns are
                      already added.
                    </MessageBar>
                  ) : (
                    <Dropdown
                      id="column-dropdown"
                      placeholder="Choose a column..."
                      value={selectedColumnData?.displayName || ""}
                      onOptionSelect={handleColumnChange}
                      className="w-full"
                    >
                      {filteredColumns.map(column => (
                        <Option key={column.id} value={column.id}>
                          {column.displayName}
                        </Option>
                      ))}
                    </Dropdown>
                  )}
                </div>
              )}

              {selectedColumnData && (
                <div className="p-3 bg-gray-50 rounded border">
                  <h4 className="font-medium mb-2">Column Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong>Name:</strong> {selectedColumnData.displayName}
                    </div>
                    <div>
                      <strong>Type:</strong> {selectedColumnData.type}
                    </div>
                    <div>
                      <strong>Level:</strong> {selectedColumnData.level}
                    </div>
                    {selectedColumnData.isCalculated && (
                      <div>
                        <strong>Calculated:</strong> Yes
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogBody>
          <DialogActions>
            <Button appearance="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={handleAddColumn}
              disabled={!canAddColumn}
            >
              Add Column
            </Button>
          </DialogActions>
        </DialogContent>
      </DialogSurface>
    </Dialog>
  );
}
