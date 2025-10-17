import { toApiAttachments } from "@/mappers/attachment-mapper";
import {
  useCreateNoteMutation,
  useDeleteAttachmentMutation,
  useGetNotesQuery,
} from "@/services/notes";
import { useAttachmentStyles } from "@/styles/template-completion-attachment";
import type { Attachment } from "@/types/template";
import {
  Button,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Text,
} from "@fluentui/react-components";
import {
  ArrowDownload20Regular,
  Attach20Regular,
  AttachArrowRightFilled,
  Delete20Regular,
  Document20Regular,
} from "@fluentui/react-icons";
import type React from "react";
import { useCallback, useMemo, useRef, useState } from "react";

type AttachmentManagerProps = {
  templateSummaryId: string;
  isLocked: boolean;
  isValidStatusForRevision: boolean;
  setWasRevisionFileReplaced: (wasReplaced: boolean) => void;
};

export default function AttachmentManager({
  templateSummaryId,
  isLocked,
  isValidStatusForRevision,
  setWasRevisionFileReplaced,
}: AttachmentManagerProps) {
  const styles = useAttachmentStyles();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({ type: null, message: null });

  const allowMultiple = isValidStatusForRevision;
  const maxAttachments = allowMultiple ? 2 : 1;

  const {
    data: attachments = [],
    isLoading: isLoadingAttachments,
    refetch: refetchAttachments,
  } = useGetNotesQuery(templateSummaryId, { skip: !templateSummaryId });

  const [createNote, { isLoading: isUploading }] = useCreateNoteMutation();
  const [deleteAttachment, { isLoading: isDeleting }] =
    useDeleteAttachmentMutation();

  const hasMaxAttachments = attachments.length >= maxAttachments;
  const currentAttachment = attachments[0];

  /** ---------------------------
   * 🔄 File Handlers
   * -------------------------- */

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const resetFeedback = useCallback(() => {
    setFeedback({ type: null, message: null });
  }, []);

  const showFeedback = useCallback(
    (type: "success" | "error", message: string) => {
      setFeedback({ type, message });
      setTimeout(resetFeedback, 3000);
    },
    [resetFeedback],
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      resetFeedback();

      if (hasMaxAttachments && !allowMultiple) {
        showFeedback(
          "error",
          `Only ${maxAttachments} attachment is allowed. Please delete or replace the existing one.`,
        );
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        showFeedback("error", "File size must be less than 10MB.");
        return;
      }

      const allowedTypes = new Set([
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png",
        "image/gif",
        "text/plain",
      ]);

      if (!allowedTypes.has(file.type)) {
        showFeedback(
          "error",
          "Unsupported file type. Upload PDF, Word, Excel, image, or text files.",
        );
        return;
      }

      try {
        const payload = await toApiAttachments(file, templateSummaryId);
        await createNote(payload).unwrap();

        if (fileInputRef.current) fileInputRef.current.value = "";
        if (isValidStatusForRevision) setWasRevisionFileReplaced(true);

        showFeedback("success", `File "${file.name}" uploaded successfully!`);
      } catch (err) {
        console.error("Upload failed:", err);
        showFeedback("error", "Failed to upload file. Please try again.");
      }
    },
    [
      hasMaxAttachments,
      allowMultiple,
      createNote,
      isValidStatusForRevision,
      maxAttachments,
      resetFeedback,
      showFeedback,
      templateSummaryId,
      setWasRevisionFileReplaced,
    ],
  );

  const handleDeleteAttachment = useCallback(
    async (attachmentId: string, fileName: string) => {
      try {
        await deleteAttachment(attachmentId).unwrap();
        await refetchAttachments();
        showFeedback("success", `File "${fileName}" deleted successfully.`);
      } catch (err) {
        console.error("Delete failed:", err);
        showFeedback("error", "Failed to delete file. Please try again.");
      }
    },
    [deleteAttachment, refetchAttachments, showFeedback],
  );

  const handleReplaceAttachment = useCallback(async () => {
    if (!currentAttachment) return;
    try {
      await deleteAttachment(currentAttachment.annotationid).unwrap();
      await refetchAttachments();
      setTimeout(handleFileSelect, 100);
    } catch (err) {
      console.error("Replace failed:", err);
      showFeedback("error", "Failed to replace attachment. Please try again.");
    }
  }, [
    currentAttachment,
    deleteAttachment,
    refetchAttachments,
    handleFileSelect,
    showFeedback,
  ]);

  /** ---------------------------
   * 🧩 Utilities
   * -------------------------- */

  const downloadDocument = useCallback((doc: Attachment) => {
    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.name;
    link.click();
  }, []);

  const getFileIcon = useCallback(() => <Document20Regular />, []);

  const uploadButtonLabel = useMemo(() => {
    if (isUploading) return "Uploading...";
    if (hasMaxAttachments) return "Replace File";
    return "Upload File";
  }, [isUploading, hasMaxAttachments]);

  const uploadButtonIcon = useMemo(() => {
    if (hasMaxAttachments) return <AttachArrowRightFilled />;
    return <Attach20Regular />;
  }, [hasMaxAttachments]);

  /** ---------------------------
   * 🧱 Render
   * -------------------------- */

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>
          {isValidStatusForRevision ? "Revision Attachment" : "Attachment"}
          {allowMultiple && ` (${attachments.length}/${maxAttachments})`}
        </Text>

        {templateSummaryId && !isLocked && (
          <div className={styles.uploadArea}>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className={styles.hiddenInput}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
            />
            <Button
              appearance="secondary"
              icon={<span>{uploadButtonIcon}</span>}
              onClick={
                hasMaxAttachments ? handleReplaceAttachment : handleFileSelect
              }
              disabled={isUploading || isDeleting}
            >
              {isUploading ? (
                <div className={styles.uploadProgress}>
                  <Spinner size="tiny" />
                  <Text>Uploading...</Text>
                </div>
              ) : (
                uploadButtonLabel
              )}
            </Button>
          </div>
        )}
      </div>

      {feedback.type && (
        <MessageBar intent={feedback.type === "error" ? "error" : "success"}>
          <MessageBarBody>
            <MessageBarTitle>
              {feedback.type === "error" ? "Error" : "Success"}
            </MessageBarTitle>
            {feedback.message}
          </MessageBarBody>
        </MessageBar>
      )}

      {isLoadingAttachments ? (
        <div>
          <Spinner size="medium" label="Loading attachment..." />
        </div>
      ) : attachments.length === 0 ? (
        <div className={styles.emptyState}>
          <Text>No attachment uploaded yet.</Text>
          {!isLocked && (
            <Text>
              Click "Upload File" to add a document, image, or text file.
            </Text>
          )}
        </div>
      ) : maxAttachments === 1 ? (
        <div className={styles.singleAttachmentCard}>
          <div className={styles.attachmentInfo}>
            {getFileIcon()}
            <div className={styles.attachmentDetails}>
              <Text className={styles.attachmentName}>
                {currentAttachment.name}
              </Text>
            </div>
          </div>

          {!isLocked && (
            <div className={styles.actionButtons}>
              <Button
                appearance="secondary"
                icon={<ArrowDownload20Regular />}
                onClick={() => downloadDocument(currentAttachment)}
                size="small"
                aria-label={`Download ${currentAttachment.name}`}
              >
                Download
              </Button>
              <Button
                appearance="subtle"
                icon={<Delete20Regular />}
                onClick={() =>
                  handleDeleteAttachment(
                    currentAttachment.annotationid,
                    currentAttachment.name ?? "",
                  )
                }
                disabled={isDeleting || isUploading}
                size="small"
                aria-label={`Delete ${currentAttachment.name}`}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.attachmentTable}>
          {attachments.map(att => (
            <div key={att.annotationid} className={styles.singleAttachmentCard}>
              <div className={styles.attachmentInfo}>
                {getFileIcon()}
                <div className={styles.attachmentDetails}>
                  <Text className={styles.attachmentName}>{att.name}</Text>
                </div>
              </div>
              {!isLocked && (
                <div className={styles.actionButtons}>
                  <Button
                    appearance="secondary"
                    icon={<ArrowDownload20Regular />}
                    onClick={() => downloadDocument(att)}
                    size="small"
                    aria-label={`Download ${att.name}`}
                  >
                    Download
                  </Button>
                  <Button
                    appearance="subtle"
                    icon={<Delete20Regular />}
                    onClick={() =>
                      handleDeleteAttachment(att.annotationid, att.name ?? "")
                    }
                    disabled={isDeleting || isUploading}
                    size="small"
                    aria-label={`Delete ${att.name}`}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
