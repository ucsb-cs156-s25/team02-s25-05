import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
// Make sure the import path is correct for your project structure
import { ucsbOrganizationFixtures } from "../../../fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBOrganizationForm tests", () => {
  const queryClient = new QueryClient();
  const expectedHeaders = [
    "Organization Code",
    "Short Organization Translation",
    "Organization Translation",
    "Inactive",
  ];
  const testIdPrefix = "UCSBOrganizationForm";

  // Helper to get the fixture data object, whether it's direct or the first element of an array
  const getOneOrg = () => {
    if (Array.isArray(ucsbOrganizationFixtures.oneOrganization)) {
      if (!ucsbOrganizationFixtures.oneOrganization.length) {
        throw new Error("Fixture data oneOrganization is an empty array!");
      }
      return ucsbOrganizationFixtures.oneOrganization[0];
    }
    return ucsbOrganizationFixtures.oneOrganization;
  };

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
    expect(screen.getByTestId(`${testIdPrefix}-orgCode`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testIdPrefix}-orgCode`)).not.toBeDisabled();
  });

  test("renders correctly when passing in initialContents", async () => {
    const oneOrg = getOneOrg(); // Use helper to get the object

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          {/* Pass the single object */}
          <UCSBOrganizationForm initialContents={oneOrg} buttonLabel="Update" />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Update/)).toBeInTheDocument();
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
    expect(screen.getByTestId(`${testIdPrefix}-orgCode`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testIdPrefix}-orgCode`)).toBeDisabled();
    expect(
      screen.getByTestId(`${testIdPrefix}-orgTranslationShort`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testIdPrefix}-orgTranslation`),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`${testIdPrefix}-inactive`)).toBeInTheDocument();

    // Check initial values using findByDisplayValue
    await screen.findByDisplayValue(oneOrg.orgCode);
    await screen.findByDisplayValue(oneOrg.orgTranslationShort);
    await screen.findByDisplayValue(oneOrg.orgTranslation);

    // Check checkbox state
    if (oneOrg.inactive) {
      expect(screen.getByTestId(`${testIdPrefix}-inactive`)).toBeChecked();
    } else {
      expect(screen.getByTestId(`${testIdPrefix}-inactive`)).not.toBeChecked();
    }
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(
      await screen.findByTestId(`${testIdPrefix}-cancel`),
    ).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testIdPrefix}-cancel`);
    fireEvent.click(cancelButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByTestId(`${testIdPrefix}-submit`);
    fireEvent.click(submitButton);

    await screen.findByText(/^Organization Code is required.$/);
    expect(
      screen.getByText(/^Short Organization Translation is required.$/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/^Organization Translation is required.$/),
    ).toBeInTheDocument();
  });
});
