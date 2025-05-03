import { toast } from "react-toastify";

/**
 * Fired when a UCSBOrganization is successfully deleted.
 * @param {string} message – the success message returned by the backend
 */
export function onDeleteSuccess(message) {
  console.log(message);
  toast(message.message);
}

/**
 * Converts a table-cell into the axios-params object needed to delete a UCSBOrganization.
 * @param {object} cell – the react-table cell containing row.values.orgCode
 */
export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/ucsborganizations",
    method: "DELETE",
    params: {
      orgCode: cell.row.values.orgCode,
    },
  };
}
