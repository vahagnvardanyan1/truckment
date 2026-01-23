'use client';

import { useCallback, useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  SxProps,
  Theme,
} from '@mui/material';
import {
  CloudUploadOutlined,
  InsertDriveFileOutlined,
  ImageOutlined,
  PictureAsPdfOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress?: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

interface FileUploadProps {
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  onUpload?: (file: File) => Promise<{ url: string } | void>;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
  multiple?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  sx?: SxProps<Theme>;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <ImageOutlined />;
  if (type === 'application/pdf') return <PictureAsPdfOutlined />;
  return <InsertDriveFileOutlined />;
}

export function FileUpload({
  value,
  onChange,
  onUpload,
  accept = '*/*',
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = true,
  disabled = false,
  error,
  helperText,
  sx,
}: FileUploadProps) {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = useCallback(
    async (fileList: FileList) => {
      const files = Array.from(fileList);
      const availableSlots = maxFiles - value.length;

      if (availableSlots <= 0) return;

      const filesToProcess = files.slice(0, availableSlots);

      for (const file of filesToProcess) {
        if (file.size > maxSize) {
          const newFile: UploadedFile = {
            id: `${Date.now()}-${file.name}`,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'error',
            error: `File exceeds maximum size of ${formatFileSize(maxSize)}`,
          };
          onChange([...value, newFile]);
          continue;
        }

        const newFile: UploadedFile = {
          id: `${Date.now()}-${file.name}`,
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          status: 'uploading',
        };

        onChange([...value, newFile]);

        if (onUpload) {
          try {
            const result = await onUpload(file);
            onChange(
              [...value, newFile].map((f: UploadedFile) =>
                f.id === newFile.id
                  ? { ...f, status: 'completed' as const, progress: 100, url: result?.url }
                  : f
              )
            );
          } catch (err) {
            onChange(
              [...value, newFile].map((f: UploadedFile) =>
                f.id === newFile.id
                  ? { ...f, status: 'error' as const, error: 'Upload failed' }
                  : f
              )
            );
          }
        } else {
          // Simulate upload for demo
          onChange(
            [...value, newFile].map((f: UploadedFile) =>
              f.id === newFile.id ? { ...f, status: 'completed' as const, progress: 100 } : f
            )
          );
        }
      }
    },
    [value, maxFiles, maxSize, onUpload, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const { files } = e.dataTransfer;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [disabled, processFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (files && files.length > 0) {
        processFiles(files);
      }
      // Reset input value to allow re-uploading same file
      e.target.value = '';
    },
    [processFiles]
  );

  const handleRemove = useCallback(
    (fileId: string) => {
      onChange(value.filter((f) => f.id !== fileId));
    },
    [value, onChange]
  );

  const handleClick = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }, [disabled]);

  const canAddMore = value.length < maxFiles;

  return (
    <Box sx={sx}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {canAddMore && (
        <Paper
          variant="outlined"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          sx={{
            p: 4,
            textAlign: 'center',
            cursor: disabled ? 'default' : 'pointer',
            borderStyle: 'dashed',
            borderColor: isDragging
              ? 'primary.main'
              : error
                ? 'error.main'
                : 'divider',
            bgcolor: isDragging
              ? alpha(theme.palette.primary.main, 0.05)
              : 'transparent',
            opacity: disabled ? 0.5 : 1,
            transition: 'all 0.2s ease-in-out',
            ...(!disabled && {
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              },
            }),
          }}
        >
          <CloudUploadOutlined
            sx={{
              fontSize: 48,
              color: isDragging ? 'primary.main' : 'text.secondary',
              mb: 2,
            }}
          />
          <Typography variant="body1" fontWeight={600} gutterBottom>
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to browse
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Max {maxFiles} files, up to {formatFileSize(maxSize)} each
          </Typography>
        </Paper>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}

      {helperText && !error && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {helperText}
        </Typography>
      )}

      {value.length > 0 && (
        <List dense sx={{ mt: 2 }}>
          {value.map((file) => (
            <ListItem
              key={file.id}
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: 1,
                mb: 1,
                border: 1,
                borderColor: file.status === 'error' ? 'error.main' : 'divider',
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary' }}>
                {getFileIcon(file.type)}
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={
                  file.status === 'error'
                    ? file.error
                    : formatFileSize(file.size)
                }
                primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                secondaryTypographyProps={{
                  variant: 'caption',
                  color: file.status === 'error' ? 'error' : 'text.secondary',
                }}
              />
              {file.status === 'uploading' && (
                <Box sx={{ width: 60, mr: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={file.progress || 0}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              )}
              {file.status === 'completed' && (
                <CheckCircleOutlined sx={{ color: 'success.main', mr: 1 }} />
              )}
              {file.status === 'error' && (
                <ErrorOutlined sx={{ color: 'error.main', mr: 1 }} />
              )}
              <ListItemSecondaryAction>
                <IconButton edge="end" size="small" onClick={() => handleRemove(file.id)}>
                  <DeleteOutlined fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
