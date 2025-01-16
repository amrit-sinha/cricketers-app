import { useState, useEffect } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sortBy, setSortBy] = useState<SortingState>(
    JSON.parse(localStorage.getItem("sortBy") || "[]")
  );
  const [filterBy, setFilterBy] = useState<string>(
    localStorage.getItem("filterBy") || "none"
  );
  const [searchBy, setSearchBy] = useState<string>(
    localStorage.getItem("searchBy") || ""
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSortBy,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sortBy,
    },
  });

  useEffect(() => {
    localStorage.setItem("sortBy", JSON.stringify(sortBy));
  }, [sortBy]);

  useEffect(() => {
    localStorage.setItem("searchBy", searchBy);
    table.getColumn("name")?.setFilterValue(searchBy);
  }, [searchBy, table]);

  useEffect(() => {
    localStorage.setItem("filterBy", filterBy);
    table
      .getColumn("type")
      ?.setFilterValue(filterBy === "none" ? null : filterBy);
  }, [filterBy, table]);

  const filterTypeMap = {
    none: "None",
    batsman: "Batsman",
    bowler: "Bowler",
    allRounder: "All Rounder",
    wicketKeeper: "Wicket Keeper",
  };

  return (
    <div className="flex flex-col justify-start">
      <div className="flex justify-start gap-4 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{`Filter by: ${
              filterTypeMap[filterBy as keyof typeof filterTypeMap]
            }`}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={filterBy}
              onValueChange={setFilterBy}
            >
              {Object.entries(filterTypeMap).map(([key, value]) => {
                return (
                  <DropdownMenuRadioItem key={key} value={key}>
                    {value}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder="Search names..."
          value={searchBy}
          onChange={(event) => setSearchBy(event.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
