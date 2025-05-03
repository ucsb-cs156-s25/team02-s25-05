import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

/* ---------- toast mock ---------- */
const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return { __esModule: true, ...originalModule, toast: (x) => mockToast(x) };
});

/* ---------- useParams / Navigate mocks ---------- */
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...original,
    useParams: () => ({ orgCode: "ENGR" }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBOrganizationEditPage tests", () => {
  /* these two blocks mirror the Restaurant tests */
  describe("when backend times out", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/ucsborganizations", {
        params: { orgCode: "ENGR" },
      }).timeout();
    });

    test("renders header but form fields not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByText("Edit UCSB Organization");
      expect(
        screen.queryByTestId("UCSBOrganizationForm-orgCode")
      ).not.toBeInTheDocument();

      restoreConsole();
    });
  });

  describe("backend working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);

      axiosMock.onGet("/api/ucsborganizations", {
        params: { orgCode: "ENGR" },
      }).reply(200, {
        orgCode: "ENGR",
        orgTranslationShort: "Engineering",
        orgTranslation: "College of Engineering",
        inactive: false,
      });

      axiosMock.onPut("/api/ucsborganizations").reply(200, {
        orgCode: "ENGR",
        orgTranslationShort: "Engr",
        orgTranslation: "College of Engineering",
        inactive: true,
      });
    });

    test("form is populated and updates on submit", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      /* wait for form to load */
      await screen.findByTestId("UCSBOrganizationForm-orgCode");

      const codeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
      const shortField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslationShort"
      );
      const transField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslation"
      );
      const inactiveCheckbox = screen.getByTestId(
        "UCSBOrganizationForm-inactive"
      );
      const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

      /* initial values */
      expect(codeField).toHaveValue("ENGR");
      expect(shortField).toHaveValue("Engineering");
      expect(transField).toHaveValue("College of Engineering");
      expect(inactiveCheckbox).not.toBeChecked();

      /* update values */
      fireEvent.change(shortField, { target: { value: "Engr" } });
      fireEvent.click(inactiveCheckbox); // now checked
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSB Organization Updated - orgCode: ENGR short: Engr"
      );
      expect(mockNavigate).toBeCalledWith({ to: "/ucsborganizations" });

      /* axios PUT payload */
      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ orgCode: "ENGR" });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          orgTranslationShort: "Engr",
          orgTranslation: "College of Engineering",
          inactive: true,
        })
      );
    });
  });
});
