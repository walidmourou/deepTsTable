import { useEffect, useState } from "react";
import { ThemeModeSwitcher } from "./components/ThemeModeSwitcher/ThemeModeSwitcher";
import DeepTable, {
  CellTextAlign,
  ColumnType,
  TableColumn,
} from "./components/deepTable/DeepTable";

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

  return (
    <div className="p-1">
      <div className="flex justify-between align-middle">
        <div>
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-3xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              TPP Data Team
            </span>{" "}
            React UI Components.
          </h1>
        </div>
        <div>
          <ThemeModeSwitcher />
        </div>
      </div>
      <div>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => setEnabledTable(!enabledTable)}
        >
          Table
        </button>
        {enabledTable && (
          <DeepTable columnNames={colNames} initialRowsValues={tableData} />
        )}
      </div>
    </div>
  );
}

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
    canFilter: true,
    canOrder: true,
  },
  {
    id: "name",
    label: "Name",
    minWidth: 10,
    align: CellTextAlign.left,
    type: ColumnType.string,
    canSearch: true,
    canOrder: true,
  },
  {
    id: "email",
    label: "Email",
    minWidth: 10,
    align: CellTextAlign.left,
    type: ColumnType.string,
    canFilter: true,
    canOrder: true,
  },
] as TableColumn[];

export default App;
