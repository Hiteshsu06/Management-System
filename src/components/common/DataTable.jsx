// hooks
import React from 'react';

// utils
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from 'primereact/skeleton';

const Datatable = ({ columns, data = [], loader, className, showGridlines }) => {
  const items = Array?.from({ length: 5 }, (v, i) => i);
  return (
    <React.Fragment>
      <DataTable
        value={data?.length === 0 && loader ? items : data}
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
            body={loader ? <Skeleton /> : col?.body}
            className="capitalize"
            headerStyle={col.headerStyle}
          />
        ))}
      </DataTable>
    </React.Fragment>
  );
};

export default Datatable;
