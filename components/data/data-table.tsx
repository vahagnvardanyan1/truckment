'use client';

import { useState, useMemo, ReactNode, useCallback } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  SxProps,
  Theme,
} from '@mui/material';
import {
  SearchOutlined,
  FilterListOutlined,
  MoreVertOutlined,
  FileDownloadOutlined,
  VisibilityOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { EmptyState } from '@/components/common/empty-state';
import { TableSkeleton } from '@/components/common/loading-skeleton';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  format?: (value: T[keyof T], row: T) => ReactNode;
  render?: (row: T) => ReactNode;
  hidden?: boolean;
}

interface RowAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  disabled?: (row: T) => boolean;
}

export interface DataTableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  loading?: boolean;
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  rowActions?: RowAction<T>[];
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: boolean;
  defaultRowsPerPage?: number;
  rowsPerPageOptions?: number[];
  defaultSortColumn?: keyof T | string;
  defaultSortDirection?: 'asc' | 'desc';
  emptyStateVariant?: 'default' | 'search' | 'vehicles' | 'fuel' | 'maintenance' | 'alerts';
  emptyStateAction?: { label: string; onClick: () => void };
  stickyHeader?: boolean;
  maxHeight?: number | string;
  sx?: SxProps<Theme>;
}

type Order = 'asc' | 'desc';

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  title,
  loading = false,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  rowActions,
  onRowClick,
  searchable = true,
  searchPlaceholder = 'Search...',
  pagination = true,
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  defaultSortColumn = '',
  defaultSortDirection = 'asc',
  emptyStateVariant = 'default',
  emptyStateAction,
  stickyHeader = false,
  maxHeight,
  sx,
}: DataTableProps<T>) {
  const theme = useTheme();
  const [order, setOrder] = useState<Order>(defaultSortDirection);
  const [orderBy, setOrderBy] = useState<keyof T | string>(defaultSortColumn);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuRow, setActionMenuRow] = useState<T | null>(null);

  const visibleColumns = useMemo(() => columns.filter((col) => !col.hidden), [columns]);

  const handleRequestSort = useCallback((property: keyof T | string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((row) => row.id);
      onSelectionChange?.(newSelected);
      return;
    }
    onSelectionChange?.([]);
  }, [data, onSelectionChange]);

  const handleSelectRow = useCallback((id: string | number) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected: (string | number)[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    onSelectionChange?.(newSelected);
  }, [selectedRows, onSelectionChange]);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleActionMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, row: T) => {
    event.stopPropagation();
    setActionMenuAnchor(event.currentTarget);
    setActionMenuRow(row);
  }, []);

  const handleActionMenuClose = useCallback(() => {
    setActionMenuAnchor(null);
    setActionMenuRow(null);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter((row) =>
      visibleColumns.some((col) => {
        const value = row[col.id as keyof T];
        return value != null && String(value).toLowerCase().includes(query);
      })
    );
  }, [data, searchQuery, visibleColumns]);

  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy as keyof T];
      const bValue = b[orderBy as keyof T];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return order === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, orderBy, order]);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage, pagination]);

  const isSelected = useCallback((id: string | number) => selectedRows.indexOf(id) !== -1, [selectedRows]);

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', ...sx }}>
        {(title || searchable) && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {title && <Typography variant="h6">{title}</Typography>}
          </Box>
        )}
        <Box sx={{ p: 2 }}>
          <TableSkeleton rows={defaultRowsPerPage} columns={visibleColumns.length} />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', ...sx }}>
      {(title || searchable || selectedRows.length > 0) && (
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            bgcolor: selectedRows.length > 0 ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
          }}
        >
          {selectedRows.length > 0 ? (
            <Typography variant="subtitle1" color="primary">
              {selectedRows.length} selected
            </Typography>
          ) : (
            title && <Typography variant="h6">{title}</Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {searchable && (
              <TextField
                size="small"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 200 }}
              />
            )}
          </Box>
        </Box>
      )}

      <TableContainer sx={{ maxHeight: maxHeight }}>
        <Table stickyHeader={stickyHeader} size="medium">
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                    checked={data.length > 0 && selectedRows.length === data.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {visibleColumns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align || 'left'}
                  scope="col"
                  style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {rowActions && rowActions.length > 0 && (
                <TableCell align="right" sx={{ width: 60 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                  sx={{ border: 0 }}
                >
                  <EmptyState
                    variant={searchQuery ? 'search' : emptyStateVariant}
                    action={emptyStateAction}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow
                    hover
                    key={row.id}
                    selected={isItemSelected}
                    onClick={() => onRowClick?.(row)}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectRow(row.id);
                          }}
                        />
                      </TableCell>
                    )}
                    {visibleColumns.map((column) => {
                      const value = row[column.id as keyof T];
                      return (
                        <TableCell key={String(column.id)} align={column.align || 'left'}>
                          {column.render
                            ? column.render(row)
                            : column.format
                              ? column.format(value, row)
                              : (value as ReactNode)}
                        </TableCell>
                      );
                    })}
                    {rowActions && rowActions.length > 0 && (
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          aria-label="Open row actions menu"
                          onClick={(e) => handleActionMenuOpen(e, row)}
                          sx={{ minWidth: 40, minHeight: 40 }}
                        >
                          <MoreVertOutlined fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && data.length > 0 && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {rowActions && (
        <Menu
          anchorEl={actionMenuAnchor}
          open={Boolean(actionMenuAnchor)}
          onClose={handleActionMenuClose}
        >
          {rowActions.map((action, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                if (actionMenuRow) {
                  action.onClick(actionMenuRow);
                }
                handleActionMenuClose();
              }}
              disabled={actionMenuRow ? action.disabled?.(actionMenuRow) : false}
            >
              {action.icon && <ListItemIcon sx={{ color: action.color }}>{action.icon}</ListItemIcon>}
              <ListItemText primaryTypographyProps={{ color: action.color }}>
                {action.label}
              </ListItemText>
            </MenuItem>
          ))}
        </Menu>
      )}
    </Paper>
  );
}
