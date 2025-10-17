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

type RevisionStatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export const RevisionStatusDialog = ({
  onOpenChange,
  open,
}: RevisionStatusDialogProps) => {
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
          <DialogTitle>AFE Status Changed!</DialogTitle>
          <DialogContent>
            AFE Status changed, we cannot send for revision with the current
            status.
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary">Ok</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
