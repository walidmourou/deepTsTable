import { useState, useEffect } from "react";

//Types, interfaces and Enums
export enum CellTextAlign {
  right = "text-right",
  center = "text-center",
  left = "text-left",
}
export enum ColumnType {
  boolean = "Boolean",
  integer = "Integer",
  float = "Float",
  string = "String",
  timestamp = "Timestamp",
}
export enum ColumnOrderType {
  asc = "Ascending",
  desc = "Descending",
  neutral = "Neutral",
}
export type TableColumn = {
  id: string;
  label: string;
  minWidth: number;
  align?: CellTextAlign;
  type: ColumnType;
  format?: (value: any) => any;
  highlight?: boolean;
  invisible?: boolean;
  canFilter?: boolean;
  canSearch?: boolean;
  canOrder?: boolean;
  // notEditable?: boolean;
  // notAddable?: boolean;
};
export type Filter = {
  [key: string]: string | number | boolean;
};
export type TableDataType = Array<Dictionary<any>>;
export interface Dictionary<T> {
  [key: string]: T;
}

type DeepTableProps = {
  columnNames: TableColumn[];
  initialRowsValues: TableDataType;
  displayHeader?: boolean;
  displayPagination?: boolean;
  selectable?: boolean;
  displayEditAction?: boolean;
  displayDeleteAction?: boolean;
  displayAddButton?: boolean;
};

function onlyUnique(value: any, index: number, array: Array<any>) {
  return array.indexOf(value) === index;
}

export const ColumnOrderSvg = ({ colOrder }: { colOrder: ColumnOrderType }) => {
  if (colOrder === ColumnOrderType.neutral) {
    return (
      <svg
        fill="#571940"
        viewBox="0 0 16 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_iconCarrier">
          <path d="M0.281 13.063l5.969-7.438c0.531-0.688 1.406-0.688 1.938 0l5.969 7.438c0.531 0.688 0.281 1.25-0.625 1.25h-12.625c-0.906 0-1.156-0.563-0.625-1.25z"></path>
          <path d="M14.156 18.938l-5.969 7.438c-0.531 0.688-1.406 0.688-1.938 0l-5.969-7.438c-0.531-0.688-0.281-1.25 0.625-1.25h12.625c0.906 0 1.156 0.563 0.625 1.25z"></path>
        </g>
      </svg>
    );
  }
  if (colOrder === ColumnOrderType.asc) {
    return (
      <svg
        fill="#df58ae"
        viewBox="0 0 16 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_iconCarrier">
          <path d="M0.281 13.063l5.969-7.438c0.531-0.688 1.406-0.688 1.938 0l5.969 7.438c0.531 0.688 0.281 1.25-0.625 1.25h-12.625c-0.906 0-1.156-0.563-0.625-1.25z"></path>

          <path d="M0.281 25.938l5.969-7.438c0.531-0.688 1.406-0.688 1.938 0l5.969 7.438c0.531 0.688 0.281 1.25-0.625 1.25h-12.625c-0.906 0-1.156-0.563-0.625-1.25z"></path>
        </g>
      </svg>
    );
  }
  return (
    <svg fill="#df58ae" viewBox="0 0 16 32" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_iconCarrier">
        <path d="M14.156 06.063l-5.969 7.438c-0.531 0.688-1.406 0.688-1.938 0l-5.969-7.438c-0.531-0.688-0.281-1.25 0.625-1.25h12.625c0.906 0 1.156 0.563 0.625 1.25z"></path>
        <path d="M14.156 18.938l-5.969 7.438c-0.531 0.688-1.406 0.688-1.938 0l-5.969-7.438c-0.531-0.688-0.281-1.25 0.625-1.25h12.625c0.906 0 1.156 0.563 0.625 1.25z"></path>
      </g>
    </svg>
  );
};

export default function DeepTable({
  columnNames = [],
  initialRowsValues = [],
  displayHeader = true,
  displayPagination = true,
  selectable = false,
  displayEditAction = false,
  displayDeleteAction = false,
  displayAddButton = false,
}: Readonly<DeepTableProps>) {
  // Deep Clone
  const [displayedRows, setDisplayedRows] = useState<TableDataType>(
    JSON.parse(JSON.stringify(initialRowsValues))
  );
  const [rowsPerPage, setRowsPerPage] = useState<string>("5");
  const [currentPage, setCurrentPage] = useState<number>(1);
  // Define Filters
  const [filters, setFilters] = useState<Filter>({});
  // Define search inputs
  const [searchFields, setSearchFields] = useState<Dictionary<string>>({});
  // Define order inputs
  const [columnOrder, setColumnOrder] = useState<Dictionary<string>>({});

  const pageFirstLastRow = (page: number) => {
    const pageFirstRow = (page - 1) * parseInt(rowsPerPage);
    const pageLastRow = pageFirstRow + parseInt(rowsPerPage);
    return [pageFirstRow, Math.min(pageLastRow, displayedRows.length)];
  };
  const pageRows = (page: number): TableDataType => {
    const [fr, lr] = pageFirstLastRow(page);
    return displayedRows.slice(fr, lr);
  };
  const rangeArray = (start: number, end: number) =>
    Array.from({ length: end + 1 - start }, (_, k) => k + start);
  const lastTablePage = () => {
    return (
      Math.floor(displayedRows.length / parseInt(rowsPerPage)) +
      (displayedRows.length % parseInt(rowsPerPage) === 0 ? 0 : 1)
    );
  };
  const getPagination = (currentPage: number) => {
    const lastPage = lastTablePage();
    if (lastPage <= 5) {
      return rangeArray(1, lastPage);
    } else if (3 <= currentPage && currentPage <= lastPage - 2) {
      return rangeArray(currentPage - 2, currentPage + 2);
    } else if (currentPage <= 2) {
      return rangeArray(1, 5);
    } else {
      return rangeArray(lastPage - 4, lastPage);
    }
  };
  const sortFunction = (colId: string) => {
    return (a: any, b: any) => {
      if (
        columnNames[columnNames.findIndex((v) => v.id === colId)]?.type ===
        ColumnType.string
      )
        return a.toString().localeCompare(b.toString());
      return a - b;
    };
  };
  const sortValuesFunction = (colId: string) => {
    return (a: any, b: any) => {
      if (
        columnNames[columnNames.findIndex((v) => v.id === colId)]?.type ===
        ColumnType.string
      )
        return a[colId].toString().localeCompare(b[colId].toString());
      return a[colId] - b[colId];
    };
  };

  useEffect(() => {
    let tmpFilters: { [key: string]: string } = {};
    let tmpSearch: { [key: string]: string } = {};
    columnNames.forEach((col) => {
      if (col.canFilter && !col.canSearch && !col.invisible) {
        tmpFilters[col.id] = "";
      } else if (col.canSearch && !col.canFilter && !col.invisible) {
        tmpSearch[col.id] = "";
      }
    });
    setFilters(tmpFilters);
    setSearchFields(tmpSearch);
  }, []);

  useEffect(() => {
    const updateDisplayedRows = () => {
      let newDisplayedRows = JSON.parse(JSON.stringify(initialRowsValues));
      Object.keys(searchFields).forEach((k) => {
        if (searchFields[k]) {
          newDisplayedRows = newDisplayedRows.filter(
            (v: { [key: string]: string }) =>
              v[k].toString().includes(searchFields[k].toString())
          );
        }
      });
      Object.keys(filters).forEach((k) => {
        if (filters[k]) {
          newDisplayedRows = newDisplayedRows.filter(
            (v: Filter) => v[k] === filters[k]
          );
        }
      });
      const colKey = Object.keys(columnOrder)[0];
      if (colKey) {
        console.log("columnOrder", columnOrder);
        newDisplayedRows.sort(sortValuesFunction(colKey));
        if (columnOrder[colKey] === ColumnOrderType.desc)
          newDisplayedRows.reverse();
      }
      return newDisplayedRows;
    };

    setDisplayedRows(updateDisplayedRows());
    setCurrentPage(1);
  }, [filters, searchFields, columnOrder]);

  //////////////////////////////////////////////////////
  // useEffect(() => {
  //   let tempRows = JSON.parse(
  //     JSON.stringify(initialRowsValues)
  //   ) as TableDataType;
  //   Object.keys(filters).forEach((key) => {
  //     if (filters[key].value) {
  //       tempRows = tempRows.filter(
  //         (row) =>
  //           row[key] ===
  //           (filters[key].type === ColumnType.boolean
  //             ? filters[key].value === "true"
  //             : filters[key].value)
  //       );
  //     }
  //   });
  //   Object.keys(searchFields).forEach((key) => {
  //     if (searchFields[key].value) {
  //       tempRows = tempRows.filter((row) =>
  //         row[key]
  //           .toString()
  //           .includes(searchFields[key].value?.toString() ?? "")
  //       );
  //     }
  //   });
  //   setDisplayedRows(tempRows);
  // }, [filters, searchFields]);
  //////////////////////////////////////////////////////
  // useEffect(() => {
  //   const columnOrder = ()
  // }, [dataOrder]);
  //////////////////////////////////////////////////////
  // const setOrder = (colId: string, upDown: string) => {
  //   const getMaxSortOrder = () => {
  //     let maxSortOrder = 0;
  //     Object.keys(dataOrder).forEach(
  //       (v) =>
  //         (maxSortOrder = Math.max(maxSortOrder, dataOrder[v].sortOrder ?? 0))
  //     );
  //     return maxSortOrder;
  //   };
  //   const getcolIdBySortOrder = () => {
  //     displayedRows.sort((a, b) => {
  //       let colOrder = Object.keys(dataOrder).forEach((v) => {
  //         if (dataOrder[v].sortOrder) {
  //           return [v, dataOrder[v].sortOrder];
  //         }
  //       });
  //       colOrder = colOrder.sort((a, b) => a[0] - b[0]);
  //     });
  //   };
  //////////////////////////////////////////////////////
  //   const selectedColumnOrder = dataOrder[colId];
  //   if (selectedColumnOrder.value === upDown) {
  //     setDataOrder({
  //       ...dataOrder,
  //       colId: {
  //         label: selectedColumnOrder.label,
  //         type: selectedColumnOrder.type,
  //         value: ColumnOrderType.neutral,
  //         sortOrder: 0,
  //       },
  //     });
  //     // FIXME: Reorder all
  //   } else if (upDown === ColumnOrderType.asc) {
  //     setDataOrder({
  //       ...dataOrder,
  //       colId: {
  //         label: selectedColumnOrder.label,
  //         type: selectedColumnOrder.type,
  //         value: ColumnOrderType.asc,
  //         sortOrder: getMaxSortOrder(),
  //       },
  //     });
  //   }
  // };
  //////////////////////////////////////////////////////
  useEffect(() => {
    const lastPage =
      Math.floor(displayedRows.length / parseInt(rowsPerPage)) +
      (displayedRows.length % parseInt(rowsPerPage) === 0 ? 0 : 1);
    setCurrentPage(currentPage > lastPage ? lastPage : currentPage);
  }, [rowsPerPage, displayedRows]);

  function columnOrderSvgClickHandler(e: { currentTarget: { id: string } }) {
    if (!(e.currentTarget.id in columnOrder)) {
      setColumnOrder({
        [e.currentTarget.id]: ColumnOrderType.asc,
      });
    } else if (columnOrder[e.currentTarget.id] == ColumnOrderType.asc) {
      setColumnOrder({
        [e.currentTarget.id]: ColumnOrderType.desc,
      });
    } else {
      setColumnOrder({});
    }
  }
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between py-1 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-start bg-white dark:bg-gray-800">
          {Object.keys(searchFields).map((colId) => (
            <div key={colId} className="mx-1">
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  key={"table-search-" + colId.toString()}
                  className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg  bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={
                    "Search for " +
                    columnNames[columnNames.findIndex((v) => v.id === colId)]
                      .label
                  }
                  value={searchFields[colId]}
                  onChange={(e) =>
                    setSearchFields({
                      ...searchFields,
                      [colId]: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-start bg-white dark:bg-gray-800">
          {Object.keys(filters).length !== 0 && (
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="h-6 w-6 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          )}
          {Object.keys(filters).map((colId) => {
            return (
              <div key={colId} className="mx-1">
                <select
                  aria-label={colId}
                  id={"table-filter-" + colId}
                  className={
                    "filterType" +
                    columnNames[columnNames.findIndex((v) => v.id === colId)]
                      .type +
                    " bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  }
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      [colId]:
                        columnNames[
                          columnNames.findIndex((v) => v.id === colId)
                        ].type === ColumnType.integer
                          ? Number(e.target.value)
                          : e.target.value.toString(),
                    });
                  }}
                  value={filters[colId].toString()}
                >
                  <option value="" className="font-bold">
                    {
                      columnNames[columnNames.findIndex((v) => v.id === colId)]
                        .label
                    }
                  </option>
                  {initialRowsValues
                    .map((v) => v[colId])
                    .filter(onlyUnique)
                    .sort(sortFunction(colId))
                    .map((v) => {
                      return (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      );
                    })}
                </select>
              </div>
            );
          })}
        </div>
        {displayAddButton && (
          <div>
            <button
              type="button"
              className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              <svg
                className="h-3.5 w-3.5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                ></path>
              </svg>
              Add
            </button>
          </div>
        )}
      </div>
      <table
        className={"w-full text-sm text-left text-gray-500 dark:text-gray-400 "}
      >
        {displayHeader && (
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {selectable && (
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-all-search" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </th>
              )}
              {columnNames.map(
                (c, idx) =>
                  !c.invisible && (
                    <th
                      key={"col" + idx.toString()}
                      scope="col"
                      className="px-6 py-3"
                    >
                      <div className="flex justify-between">
                        <div>{c.label}</div>
                        {c.canOrder && (
                          <div>
                            <div
                              className="w-3 h-3 cursor-pointer"
                              id={c.id}
                              onClick={columnOrderSvgClickHandler}
                            >
                              {!(c.id in columnOrder) ? (
                                <ColumnOrderSvg
                                  colOrder={ColumnOrderType.neutral}
                                />
                              ) : columnOrder[c.id] == ColumnOrderType.asc ? (
                                <ColumnOrderSvg
                                  colOrder={ColumnOrderType.asc}
                                />
                              ) : (
                                <ColumnOrderSvg
                                  colOrder={ColumnOrderType.desc}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </th>
                  )
              )}
              {(displayEditAction || displayDeleteAction) && (
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              )}
            </tr>
          </thead>
        )}
        <tbody>
          {pageRows(currentPage).map((row, rid) => {
            return (
              <tr
                key={"row" + rid.toString()}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {selectable && (
                  <td key={rid.toString() + "-select"} className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                )}
                {columnNames.map((col, cid) => {
                  return (
                    !col.invisible && (
                      <td
                        key={rid.toString() + "-" + cid.toString()}
                        className={
                          "px-6 py-4 " +
                          (col.highlight
                            ? "font-medium text-gray-900 whitespace-nowrap dark:text-white "
                            : "") +
                          (col.align ? col.align : "text-center")
                        }
                      >
                        {col.type === ColumnType.boolean &&
                          row[col.id] === true && (
                            <img
                              src="checked.jpg"
                              alt="checked"
                              width="10"
                              height="10"
                            />
                          )}
                        {col.type === ColumnType.boolean &&
                          row[col.id] === false && (
                            <img
                              src="unchecked.jpg"
                              alt="unchecked"
                              width="10"
                              height="10"
                            />
                          )}
                        {col.type === ColumnType.boolean &&
                          row[col.id] === null && (
                            <img
                              src="undefined.jpg"
                              alt="undefined"
                              width="10"
                              height="10"
                            />
                          )}

                        {col.type !== ColumnType.boolean &&
                          row[col.id].toString()}
                      </td>
                    )
                  );
                })}
                {(displayEditAction || displayDeleteAction) && (
                  <td
                    key={rid.toString() + "-action"}
                    className="flex items-center px-6 py-4 space-x-3"
                  >
                    {displayEditAction && (
                      <button
                        type="button"
                        className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs px-2 py-1 text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
                      >
                        Edit
                      </button>
                    )}
                    {displayDeleteAction && (
                      <button
                        type="button"
                        className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {displayPagination && (
        <nav
          className="flex items-center justify-between pt-4"
          aria-label="Table navigation"
        >
          <div>
            <select
              aria-label="Pagination"
              id="small"
              className="p-2 mb-1 mr-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setRowsPerPage(e.target.value)}
              value={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
            </select>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {pageFirstLastRow(currentPage)[0] + 1}-
                {pageFirstLastRow(currentPage)[1]}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {displayedRows.length}
              </span>
            </span>
          </div>
          <ul className="inline-flex -space-x-px text-sm h-8">
            <li>
              <button
                type="button"
                className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => {
                  if (currentPage !== 1) {
                    setCurrentPage(1);
                  }
                }}
              >
                {"<<"}
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => {
                  if (currentPage !== 1) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
              >
                {"<"}
              </button>
            </li>

            {getPagination(currentPage).map((v) => (
              <li key={v}>
                <button
                  type="button"
                  className={
                    "flex items-center justify-center px-3 h-8 border-gray-300 dark:border-gray-700 " +
                    (v === currentPage
                      ? "text-gray-500 border  bg-white   hover:bg-gray-100  hover:text-gray-700 dark:bg-gray-800  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white leading-tight"
                      : "text-blue-600 border  bg-blue-50 hover:bg-blue-100  hover:text-blue-700 dark:bg-gray-700  dark:text-white")
                  }
                  onClick={(e) => {
                    if (currentPage !== parseInt(e.currentTarget.innerText)) {
                      setCurrentPage(parseInt(e.currentTarget.innerText));
                    }
                  }}
                >
                  {v}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => {
                  if (currentPage !== lastTablePage()) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
              >
                {">"}
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => {
                  if (currentPage !== lastTablePage()) {
                    setCurrentPage(lastTablePage());
                  }
                }}
              >
                {">>"}
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
