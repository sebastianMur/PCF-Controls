import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  type DialogOpenChangeEvent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner,
} from "@fluentui/react-components";

type SendForRevisionDialogProps = {
  onConfirm: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoadingData: boolean;
};

export const SendForRevisionDialog = ({
  onConfirm,
  open,
  onOpenChange,
  isLoadingData,
}: SendForRevisionDialogProps) => {
  const handleOpenChange = (
    _event: DialogOpenChangeEvent,
    data: { open: boolean },
  ) => {
    onOpenChange(data.open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            Are you sure you want to send this item for revision?
            <br />
            This action cannot be undone.
          </DialogContent>

          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <Button appearance="primary" onClick={onConfirm}>
              {isLoadingData && (
                <Spinner
                  size="tiny"
                  style={{
                    marginRight: 8,
                  }}
                />
              )}
              Yes, Send
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
