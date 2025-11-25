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
import { ErrorCircleColor } from "@fluentui/react-icons";

type InvalidUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string,
  title: string
};
export const InvalidUserDialog = ({
  onOpenChange,
  open,
  message,
  title
}: InvalidUserDialogProps) => {
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

          <DialogTitle style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "5px",

          }}><ErrorCircleColor />{title}</DialogTitle>
          <DialogContent>
            {message}
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
