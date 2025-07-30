import {
  useDeleteAttachmentMutation,
  useGetAttachmentsQuery,
  useUploadAttachmentMutation,
} from "@/services/notes";
import { useAttachmentStyles } from "@/styles/template-completion-attachment";
import {
  Button,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  tokens,
} from "@fluentui/react-components";
import {
  ArrowDownload20Regular,
  Attach20Regular,
  AttachArrowRightFilled,
  Delete20Regular,
  Dismiss24Regular,
  Document20Regular,
} from "@fluentui/react-icons";
import type React from "react";
import { useRef, useState } from "react";

interface AttachmentManagerProps {
  templateSummaryId: string;
  isLocked: boolean;
}

// Configuration for attachment limits
const ATTACHMENT_CONFIG = {
  maxAttachments: 1, // Change this to allow more attachments in the future
  allowMultiple: false, // Set to true to enable multiple attachments
};

export default function AttachmentManager({
  templateSummaryId,
  isLocked,
}: AttachmentManagerProps) {
  const styles = useAttachmentStyles();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const {
    data: attachments = [],
    isLoading: isLoadingAttachments,
    refetch: refetchAttachments,
  } = useGetAttachmentsQuery(templateSummaryId);

  const [uploadAttachment, { isLoading: isUploading }] =
    useUploadAttachmentMutation();
  const [deleteAttachment, { isLoading: isDeleting }] =
    useDeleteAttachmentMutation();

  const hasMaxAttachments =
    attachments.length >= ATTACHMENT_CONFIG.maxAttachments;
  const currentAttachment = attachments[0]; // Get the single attachment

  const handleFileSelect = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous messages
    setUploadError(null);
    setUploadSuccess(null);

    // Check if we already have the maximum number of attachments
    if (hasMaxAttachments && !ATTACHMENT_CONFIG.allowMultiple) {
      setUploadError(
        `Only ${ATTACHMENT_CONFIG.maxAttachments} attachment is allowed. Please delete the existing attachment first or replace it.`,
      );
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
      "image/gif",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "File type not supported. Please upload PDF, Word, Excel, image, or text files.",
      );
      return;
    }

    try {
      console.log(
        "Uploading file:",
        file.name,
        "to template:",
        templateSummaryId,
      );

      const result = await uploadAttachment({
        file,
        templateSummaryId,
      }).unwrap();

      console.log("Upload successful:", result);

      setUploadSuccess(`File "${file.name}" uploaded successfully!`);

      // Refetch attachments to update the list
      await refetchAttachments();

      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Failed to upload file. Please try again.");
    }
  };

  const handleDeleteAttachment = async (
    attachmentId: string,
    fileName: string,
  ): Promise<void> => {
    try {
      console.log("Deleting attachment:", attachmentId);

      await deleteAttachment(attachmentId).unwrap();

      console.log("Delete successful");

      setUploadSuccess(`File "${fileName}" deleted successfully!`);

      // Refetch attachments to update the list
      await refetchAttachments();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to delete attachment:", error);
      setUploadError("Failed to delete file. Please try again.");
    }
  };

  const handleReplaceAttachment = async (): Promise<void> => {
    if (currentAttachment) {
      // Delete current attachment first, then allow new upload
      try {
        await deleteAttachment(currentAttachment.attachmentId).unwrap();
        await refetchAttachments();
        // Trigger file selection after deletion
        setTimeout(() => {
          handleFileSelect();
        }, 100);
      } catch (error) {
        setUploadError("Failed to replace attachment. Please try again.");
      }
    }
  };

  const handleDownloadAttachment = async (): Promise<void> => {
    try {
      // In a real application, you would fetch the file from the server
      // For now, we'll simulate the download process
      console.log("Downloading attachment:", currentAttachment.fileName);

      // Create a temporary link element for download
      const link = document.createElement("a");
      link.href = currentAttachment.fileUrl;
      link.download = currentAttachment.fileName;
      link.target = "_blank";

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      setUploadSuccess(
        `File "${currentAttachment.fileName}" download started!`,
      );

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to download attachment:", error);
      setUploadError("Failed to download file. Please try again.");
    }
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (_fileType: string): React.ReactNode => {
    // You could customize icons based on file type
    return <Document20Regular />;
  };

  const getUploadButtonText = (): string => {
    if (isUploading) return "Uploading...";
    if (hasMaxAttachments) return "Replace File";
    return "Upload File";
  };

  const getUploadButtonIcon = (): React.ReactNode => {
    if (isUploading) return <Spinner size="tiny" />;
    if (hasMaxAttachments) return <AttachArrowRightFilled />;
    return <Attach20Regular />;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>
          Attachment{" "}
          {ATTACHMENT_CONFIG.maxAttachments === 1
            ? ""
            : `(${attachments.length}/${ATTACHMENT_CONFIG.maxAttachments})`}
        </Text>
        {!isLocked && (
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
              icon={<span> {getUploadButtonIcon()} </span>}
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
                getUploadButtonText()
              )}
            </Button>
          </div>
        )}
      </div>

      {uploadError && (
        <MessageBar intent="error">
          <MessageBarBody>
            <MessageBarTitle>Error</MessageBarTitle>
            {uploadError}
            <MessageBarActions
              containerAction={
                <Button onClick={() => setUploadError(null)}>
                  <Dismiss24Regular />
                </Button>
              }
            />
          </MessageBarBody>
        </MessageBar>
      )}

      {uploadSuccess && (
        <MessageBar intent="success">
          <MessageBarBody>
            <MessageBarTitle>Error</MessageBarTitle>
            {uploadSuccess}
            <MessageBarActions
              containerAction={
                <Button onClick={() => setUploadSuccess(null)}>
                  <Dismiss24Regular />
                </Button>
              }
            />
          </MessageBarBody>
        </MessageBar>
      )}

      {isLoadingAttachments ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: tokens.spacingVerticalL,
          }}
        >
          <Spinner size="medium" label="Loading attachment..." />
        </div>
      ) : attachments.length === 0 ? (
        <div className={styles.emptyState}>
          <Text>No attachment uploaded yet.</Text>
          {!isLocked && (
            <Text
              style={{
                fontSize: tokens.fontSizeBase200,
                marginTop: tokens.spacingVerticalXS,
              }}
            >
              Click "Upload File" to add a document, image, or other file.
            </Text>
          )}
        </div>
      ) : ATTACHMENT_CONFIG.maxAttachments === 1 ? (
        // Single attachment card view
        <div className={styles.singleAttachmentCard}>
          <div className={styles.attachmentInfo}>
            {getFileIcon(currentAttachment.fileType)}
            <div className={styles.attachmentDetails}>
              <Text className={styles.attachmentName}>
                {currentAttachment.fileName}
              </Text>
              <Text className={styles.attachmentMeta}>
                {formatFileSize(currentAttachment.fileSize)} •{" "}
                {currentAttachment.fileType} •{" "}
                {formatDate(currentAttachment.uploadDate)}
              </Text>
            </div>
          </div>
          {!isLocked && (
            <div className={styles.actionButtons}>
              <Button
                appearance="secondary"
                icon={<ArrowDownload20Regular />}
                onClick={() => handleDownloadAttachment()}
                size="small"
                aria-label={`Download ${currentAttachment.fileName}`}
              >
                Download
              </Button>
              <Button
                appearance="subtle"
                icon={<Delete20Regular />}
                onClick={() =>
                  handleDeleteAttachment(
                    currentAttachment.attachmentId,
                    currentAttachment.fileName,
                  )
                }
                disabled={isDeleting || isUploading}
                aria-label={`Delete ${currentAttachment.fileName}`}
                size="small"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Table view for multiple attachments (future use)
        <div className={styles.attachmentTable}>
          <Table aria-label="Attachments table">
            <TableHeader>
              <TableRow>
                <TableHeaderCell>File Name</TableHeaderCell>
                <TableHeaderCell>Size</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Upload Date</TableHeaderCell>
                {!isLocked && <TableHeaderCell>Actions</TableHeaderCell>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {attachments.map(attachment => (
                <TableRow key={attachment.attachmentId}>
                  <TableCell>
                    <div className={styles.fileIcon}>
                      {getFileIcon(attachment.fileType)}
                      <Text>{attachment.fileName}</Text>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Text className={styles.fileSize}>
                      {formatFileSize(attachment.fileSize)}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text className={styles.fileSize}>
                      {attachment.fileType}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text>{formatDate(attachment.uploadDate)}</Text>
                  </TableCell>
                  {!isLocked && (
                    <TableCell>
                      <Button
                        appearance="subtle"
                        icon={<Delete20Regular />}
                        onClick={() =>
                          handleDeleteAttachment(
                            attachment.attachmentId,
                            attachment.fileName,
                          )
                        }
                        disabled={isDeleting}
                        aria-label={`Delete ${attachment.fileName}`}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
