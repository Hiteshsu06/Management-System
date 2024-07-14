import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Datatable = ({ columns, data = [], className, showGridlines }) => {
  return (
    <div>
      <DataTable
        value={data}
        tableStyle={{ minWidth: "50rem" }}
        className={className}
        showGridlines={showGridlines}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
      >
        {columns?.map((col, i) => (
          <Column
            key={i}
            field={col?.field}
            header={col?.header}
            body={col?.body}
            className="capitalize"
            headerStyle={col.headerStyle}
          />
        ))}
      </DataTable>
    </div>
  );
};

export default Datatable;
