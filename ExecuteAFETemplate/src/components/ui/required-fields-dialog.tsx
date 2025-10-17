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
} from "@fluentui/react-components";

type RequiredFieldModalProps = {
  requiredFieldsMessages: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export const RequiredFieldModal = ({
  onOpenChange,
  open,
  requiredFieldsMessages,
}: RequiredFieldModalProps) => {
  const handleOpenChange = (
    _event: DialogOpenChangeEvent,
    data: { open: boolean },
  ) => {
    onOpenChange(data.open);
  };

  return (
    <>
      <Dialog modalType="non-modal" open={open} onOpenChange={handleOpenChange}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle action={null}>Required Fields</DialogTitle>
            <DialogContent>
              {requiredFieldsMessages.map(message => (
                <p key={message}>⛔️ {message}</p>
              ))}
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Close</Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};
