import {onDeleteSuccess,cellToAxiosParamsDelete,} from "main/utils/UCSBOrganizationUtils";
import mockConsole from "jest-mock-console";
  
const mockToast = jest.fn();
jest.mock("react-toastify", () => {
const originalModule = jest.requireActual("react-toastify");
    return {
        __esModule: true,
        ...originalModule,
        toast: (msg) => mockToast(msg),   
    };
});

describe("UCSBOrganizationUtils", () => {
    describe("onDeleteSuccess", () => {
        test("logs the message and shows a toast", () => {
            const restoreConsole = mockConsole();

            onDeleteSuccess("deleted!");

            expect(mockToast).toHaveBeenCalledWith("deleted!");
            expect(console.log).toHaveBeenCalled();
            expect(console.log.mock.calls[0][0]).toMatch("deleted!");

            restoreConsole();
        });
    });

    describe("cellToAxiosParamsDelete", () => {
        test("returns correct axios params", () => {
            const cell = { row: { values: { orgCode: "ENGR" } } };
            const result = cellToAxiosParamsDelete(cell);

            expect(result).toEqual({
                url: "/api/ucsborganizations",
                method: "DELETE",
                params: { orgCode: "ENGR" },
            });
        });
    });
});
