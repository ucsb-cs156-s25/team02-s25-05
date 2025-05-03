import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBOrganizationTable tests", () => {
  const queryClient = new QueryClient();
  const expectedHeaders = [
    "Org Code",
    "Org Translation Short",
    "Org Translation",
    "Inactive",
  ];
  const expectedFields = [
    "orgCode",
    "orgTranslationShort",
    "orgTranslation",
    "inactive",
  ];
  const testId = "UCSBOrganizationTable";

  test("renders empty table correctly", () => {
    const currentUser = currentUserFixtures.adminUser;
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsbOrganizations={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expectedHeaders.forEach(h => {
      expect(screen.getByText(h)).toBeInTheDocument();
    });
    expectedFields.forEach(f => {
      expect(screen.queryByTestId(`${testId}-cell-row-0-col-${f}`)).not.toBeInTheDocument();
    });
  });

  test("Has expected columns, content and buttons for admin user", () => {
    const currentUser = currentUserFixtures.adminUser;
    const fixtures = ucsbOrganizationFixtures.threeOrganizations;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsbOrganizations={fixtures} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expectedHeaders.forEach(h => {
      expect(screen.getByText(h)).toBeInTheDocument();
    });
    expectedFields.forEach(f => {
      expect(screen.getByTestId(`${testId}-cell-row-0-col-${f}`)).toBeInTheDocument();
    });

    const firstOrg = fixtures[0];
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent(firstOrg.orgCode);
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent(firstOrg.orgTranslationShort);

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Has expected columns and content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;
    const fixtures = ucsbOrganizationFixtures.threeOrganizations;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsbOrganizations={fixtures} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expectedHeaders.forEach(h => {
      expect(screen.getByText(h)).toBeInTheDocument();
    });
    expectedFields.forEach(f => {
      expect(screen.getByTestId(`${testId}-cell-row-0-col-${f}`)).toBeInTheDocument();
    });

    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  test("Edit button navigates to the edit page", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const fixtures = ucsbOrganizationFixtures.threeOrganizations;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsbOrganizations={fixtures} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const firstOrg = fixtures[0];
    fireEvent.click(screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`));
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith(
        `/ucsborganizations/edit/${firstOrg.orgCode}`
      )
    );
  });

  test("Delete button calls delete callback", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const fixtures = ucsbOrganizationFixtures.threeOrganizations;
    const axiosMock = new AxiosMockAdapter(axios);

    axiosMock
      .onDelete("/api/ucsborganizations")
      .reply(200, { message: "Deleted successfully" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsbOrganizations={fixtures} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`));
    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({
      orgCode: fixtures[0].orgCode,
    });
  });
});
