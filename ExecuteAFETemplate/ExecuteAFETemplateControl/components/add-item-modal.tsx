import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
  Text,
  Textarea,
} from '@fluentui/react-components';
import { modalStyles } from '@utils/styles/modal';
import { useState } from 'react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onAdd: (data: any) => void;
  type: 'category' | 'subcategory' | 'lineitem';
  parentName?: string;
}

export default function AddItemModal({ isOpen, onClose, onAdd, type, parentName }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    unitPrice: '',
    unit: '',
    quantity: '',
    budget: '',
  });
  const styles = modalStyles();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const data: any = {
      name: formData.name,
    };

    if (type === 'category') {
      data.description = formData.description;
      data.budget = formData.budget ? Number.parseFloat(formData.budget) : 0;
    } else if (type === 'subcategory') {
      data.code = formData.code;
      data.gfcmId = `${Math.floor(Math.random() * 90000) + 10000} ${formData.name.toUpperCase()}`;
    } else if (type === 'lineitem') {
      data.unitPrice = formData.unitPrice ? Number.parseFloat(formData.unitPrice) : 0;
      data.unit = formData.unit;
      data.quantity = formData.quantity ? Number.parseInt(formData.quantity) : 1;
      data.total = (Number.parseFloat(formData.unitPrice) || 0) * (Number.parseInt(formData.quantity) || 1);
    }

    onAdd(data);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      code: '',
      unitPrice: '',
      unit: '',
      quantity: '',
      budget: '',
    });
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case 'category':
        return 'Add New Category';
      case 'subcategory':
        return `Add New Subcategory${parentName ? ` to ${parentName}` : ''}`;
      case 'lineitem':
        return `Add New Line Item${parentName ? ` to ${parentName}` : ''}`;
      default:
        return 'Add New Item';
    }
  };

  const canSubmit = formData.name.trim() !== '';

  return (
    <Dialog open={isOpen} onOpenChange={(_event, data) => !data.open && handleClose()}>
      <DialogSurface>
        <DialogTitle>{getTitle()}</DialogTitle>
        <DialogContent>
          <DialogBody>
            <div className={styles.formContainer}>
              <Field label='Name' required>
                <Input
                  value={formData.name}
                  onChange={(_e, data) => handleInputChange('name', data.value)}
                  placeholder={`Enter ${type} name`}
                />
              </Field>

              {type === 'category' && (
                <>
                  <Field label='Description'>
                    <Textarea
                      value={formData.description}
                      onChange={(_e, data) => handleInputChange('description', data.value)}
                      placeholder='Enter category description'
                      rows={3}
                    />
                  </Field>
                  <Field label='Budget'>
                    <Input
                      type='number'
                      value={formData.budget}
                      onChange={(_e, data) => handleInputChange('budget', data.value)}
                      placeholder='Enter budget amount'
                    />
                  </Field>
                </>
              )}

              {type === 'subcategory' && (
                <Field label='Code'>
                  <Input
                    value={formData.code}
                    onChange={(_e, data) => handleInputChange('code', data.value)}
                    placeholder='Enter subcategory code'
                  />
                </Field>
              )}

              {type === 'lineitem' && (
                <>
                  <div className={styles.gridContainer}>
                    <Field label='Unit Price' required>
                      <Input
                        type='number'
                        step='0.01'
                        value={formData.unitPrice}
                        onChange={(_e, data) => handleInputChange('unitPrice', data.value)}
                        placeholder='0.00'
                      />
                    </Field>
                    <Field label='Unit'>
                      <Input
                        value={formData.unit}
                        onChange={(_e, data) => handleInputChange('unit', data.value)}
                        placeholder='e.g., Per day, per foot'
                      />
                    </Field>
                  </div>
                  <Field label='Quantity' required>
                    <Input
                      type='number'
                      value={formData.quantity}
                      onChange={(_e, data) => handleInputChange('quantity', data.value)}
                      placeholder='1'
                    />
                  </Field>
                  {formData.unitPrice && formData.quantity && (
                    <div className={styles.calculatedTotal}>
                      <Text className={styles.totalText}>
                        Calculated Total: $
                        {((Number.parseFloat(formData.unitPrice) || 0) * (Number.parseInt(formData.quantity) || 1)).toFixed(2)}
                      </Text>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogBody>
          <DialogActions>
            <Button appearance='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button appearance='primary' onClick={handleSubmit} disabled={!canSubmit}>
              Add {type === 'lineitem' ? 'Line Item' : type === 'subcategory' ? 'Subcategory' : 'Category'}
            </Button>
          </DialogActions>
        </DialogContent>
      </DialogSurface>
    </Dialog>
  );
}
