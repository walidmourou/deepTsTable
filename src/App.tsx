import { useEffect, useState } from "react";

import DeepTable from "./components/deepTable/DeepTable";
import {
  ColumnType,
  TableColumn,
  CellTextAlign,
} from "./components/deepTable/tableTypes";

function App() {
  const [enabledTable, setEnabledTable] = useState(false);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/comments")
      .then((resp) => resp.json())
      .then((resp) => {
        setTableData(resp);
      });
  }, []);

  const colNames = [
    {
      id: "id",
      label: "ID",
      minWidth: 10,
      align: CellTextAlign.right,
      type: ColumnType.integer,
    },
    {
      id: "postId",
      label: "Post ID",
      minWidth: 10,
      align: CellTextAlign.right,
      type: ColumnType.integer,
      filtering: true,
    },
    {
      id: "name",
      label: "Name",
      minWidth: 10,
      align: CellTextAlign.left,
      type: ColumnType.string,
      searchable: true,
    },
    {
      id: "email",
      label: "Email",
      minWidth: 10,
      align: CellTextAlign.left,
      type: ColumnType.string,
    },
  ] as TableColumn[];
  return (
    <div className="p-1">
      <h1>Components List</h1>
      <div>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => setEnabledTable(!enabledTable)}
        >
          Table
        </button>
        {enabledTable && (
          <DeepTable columnNames={colNames} rowsValues={tableData} />
        )}
      </div>
    </div>
  );
}

export default App;
