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
import { SendColor } from "@fluentui/react-icons";

type AFECreationDialogProps = {
  warningFields: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleSendingAFEExecute: () => void;
  isSending: boolean;
};

export const AFECreationDialog = ({
  onOpenChange,
  open,
  warningFields,
  handleSendingAFEExecute,
  isSending,
}: AFECreationDialogProps) => {
  const hasWarnings = warningFields.length > 0;

  const handleOpenChange = (
    _event: DialogOpenChangeEvent,
    data: { open: boolean },
  ) => {
    onOpenChange(data.open);
  };

  return (
    <Dialog modalType="non-modal" open={open} onOpenChange={handleOpenChange}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle action={null}>
            {hasWarnings
              ? "Review Required Before Submission"
              : "Confirm AFE Submission"}
          </DialogTitle>

          <DialogContent style={{
                    display:"flex",
                    flexDirection:"column",
                    gap:"12px"                   
          }}>
            {hasWarnings ? (
              <>
                <p>
                  You are about to submit this AFE for execution.
                  Please review the items below before proceeding.
                </p>

                <p>
                  <strong>The following items require your attention:</strong>
                </p>

                {warningFields.map(message => (
                  <p key={message}>⚠️ {message}</p>
                ))}
              </>
            ) : (
              <>
                <p>
                  You are about to submit this AFE for execution.
                </p>
                <p>
                  Once submitted, this action cannot be undone.
                </p>
                <p>
                  <strong>Do you want to continue?</strong>
                </p>
              </>
            )}
          </DialogContent>

          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>

            <DialogTrigger disableButtonEnhancement>
              <Button
                appearance="primary"
                icon={<SendColor />}
                onClick={handleSendingAFEExecute}
                disabled={isSending}
              >
                {isSending ? "Submitting..." : "Submit AFE"}
              </Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
