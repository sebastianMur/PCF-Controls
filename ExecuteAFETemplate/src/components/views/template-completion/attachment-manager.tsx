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

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /** ---------------------------
   * Upload / Delete Logic
   * -------------------------- */
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      resetFeedback();

      const currentAttachmentsCount = attachments.length;

      // Validate count
      if (currentAttachmentsCount >= maxAttachments) {
        showFeedback(
          "error",
          `Only ${maxAttachments} attachment${maxAttachments > 1 ? "s" : ""} allowed. Please delete or replace the revision file.`,
        );
        return;
      }

      // Validate size
      if (file.size > 10 * 1024 * 1024) {
        showFeedback("error", "The file must be smaller than 10 MB.");
        return;
      }

      // Validate type
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
          "Unsupported file type. Only PDF, Word, Excel, image, or text files are allowed.",
        );
        return;
      }

      try {
        // ✅ Check if a file with the same name already exists
        const existingNames = attachments.map(a => a.name.toLowerCase());
        let newFileName = file.name;

        if (existingNames.includes(file.name.toLowerCase())) {
          const dotIndex = file.name.lastIndexOf(".");
          const baseName =
            dotIndex !== -1 ? file.name.slice(0, dotIndex) : file.name;
          const extension = dotIndex !== -1 ? file.name.slice(dotIndex) : "";
          let version = 2;

          // If versions like (vX) already exist, increment the number
          while (
            existingNames.includes(
              `${baseName} (v${version})${extension}`.toLowerCase(),
            )
          ) {
            version++;
          }

          newFileName = `${baseName} (v${version})${extension}`;
        }

        // ✅ Create a new File with the modified name if needed
        const renamedFile =
          newFileName !== file.name
            ? new File([file], newFileName, { type: file.type })
            : file;

        const payload = await toApiAttachments(renamedFile, templateSummaryId);
        await createNote(payload).unwrap();

        if (fileInputRef.current) fileInputRef.current.value = "";

        // Mark revision as replaced
        if (isValidStatusForRevision) setWasRevisionFileReplaced(true);

        showFeedback("success", `File "${newFileName}" uploaded successfully.`);
        await refetchAttachments();
      } catch (err) {
        console.error("Upload failed:", err);
        showFeedback("error", "Failed to upload the file. Please try again.");
      }
    },
    [
      attachments.length,
      createNote,
      isValidStatusForRevision,
      maxAttachments,
      refetchAttachments,
      resetFeedback,
      showFeedback,
      templateSummaryId,
      setWasRevisionFileReplaced,
      attachments,
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
        showFeedback("error", "Failed to delete the file.");
      }
    },
    [deleteAttachment, refetchAttachments, showFeedback],
  );

  const handleReplaceAttachment = useCallback(async () => {
    const revisionAttachment = attachments[1]; // second attachment
    if (!revisionAttachment) return;

    try {
      await deleteAttachment(revisionAttachment.annotationid).unwrap();
      await refetchAttachments();
      setTimeout(handleFileSelect, 100);
    } catch (err) {
      console.error("Replace failed:", err);
      showFeedback("error", "Failed to replace the revision file.");
    }
  }, [
    attachments,
    deleteAttachment,
    refetchAttachments,
    handleFileSelect,
    showFeedback,
  ]);

  /** ---------------------------
   * Utilities
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
    return hasMaxAttachments ? "Replace revision file" : "Upload file";
  }, [isUploading, hasMaxAttachments]);

  const uploadButtonIcon = useMemo(() => {
    if (hasMaxAttachments) return <AttachArrowRightFilled />;
    return <Attach20Regular />;
  }, [hasMaxAttachments]);

  /** ---------------------------
   * Render
   * -------------------------- */
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>
          {isValidStatusForRevision ? "Revision attachment" : "Attachment"}
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
            {(!hasMaxAttachments || isValidStatusForRevision) && (
              <Button
                appearance="secondary"
                icon={<span>{uploadButtonIcon}</span>}
                onClick={
                  hasMaxAttachments && isValidStatusForRevision
                    ? handleReplaceAttachment
                    : handleFileSelect
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
            )}
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
          <Spinner size="medium" label="Loading attachments..." />
        </div>
      ) : attachments.length === 0 ? (
        <div className={styles.emptyState}>
          <Text>No attachments yet.</Text>
        </div>
      ) : allowMultiple ? (
        // Revision mode (2 possible attachments)
        <div className={styles.attachmentTable}>
          {attachments.map((att, index) => {
            const isRevisionAttachment = index === 1;

            return (
              <div
                key={att.annotationid}
                className={styles.singleAttachmentCard}
              >
                <div className={styles.attachmentInfo}>
                  {getFileIcon()}
                  <div className={styles.attachmentDetails}>
                    <Text className={styles.attachmentName}>{att.name}</Text>
                    {isRevisionAttachment ? (
                      <Text>Revision file</Text>
                    ) : (
                      <Text style={{ opacity: 0.6 }}>
                        Base attachment (locked)
                      </Text>
                    )}
                  </div>
                </div>

                {!isLocked && (
                  <div className={styles.actionButtons}>
                    <Button
                      appearance="secondary"
                      icon={<ArrowDownload20Regular />}
                      onClick={() => downloadDocument(att)}
                      size="small"
                    >
                      Download
                    </Button>
                    {isRevisionAttachment && (
                      <Button
                        appearance="subtle"
                        icon={<Delete20Regular />}
                        onClick={() =>
                          handleDeleteAttachment(
                            att.annotationid,
                            att.name ?? "",
                          )
                        }
                        disabled={isDeleting || isUploading}
                        size="small"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Normal mode (1 attachment)
        <div className={styles.singleAttachmentCard}>
          <div className={styles.attachmentInfo}>
            {getFileIcon()}
            <div className={styles.attachmentDetails}>
              <Text className={styles.attachmentName}>
                {attachments[0].name}
              </Text>
            </div>
          </div>

          {!isLocked && (
            <div className={styles.actionButtons}>
              <Button
                appearance="secondary"
                icon={<ArrowDownload20Regular />}
                onClick={() => downloadDocument(attachments[0])}
                size="small"
              >
                Download
              </Button>
              <Button
                appearance="subtle"
                icon={<Delete20Regular />}
                onClick={() =>
                  handleDeleteAttachment(
                    attachments[0].annotationid,
                    attachments[0].name ?? "",
                  )
                }
                disabled={isDeleting || isUploading}
                size="small"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
