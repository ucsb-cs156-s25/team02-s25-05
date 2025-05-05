import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

/* ---------- mock react‑toastify ---------- */
const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const original = jest.requireActual("react-toastify");
  return { __esModule: true, ...original, toast: (x) => mockToast(x) };
});

/* ---------- mock Navigate so we can assert redirect ---------- */
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...original,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBOrganizationCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();

    // currentUser + systemInfo GETs
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  /* ---------- basic render ---------- */
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByLabelText("Organization Code");
  });

  /* ---------- happy‑path submit ---------- */
  test("on submit, makes POST and redirects to /ucsborganizations", async () => {
    const newOrg = {
      orgCode: "ENGR",
      orgTranslationShort: "Engineering",
      orgTranslation: "College of Engineering",
      inactive: true,
    };

    axiosMock.onPost("/api/ucsborganizations/post").reply(202, newOrg);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    /* fill out the form */
    fireEvent.change(screen.getByLabelText("Organization Code"), {
      target: { value: "ENGR" },
    });
    fireEvent.change(screen.getByLabelText("Short Organization Translation"), {
      target: { value: "Engineering" },
    });
    fireEvent.change(screen.getByLabelText("Organization Translation"), {
      target: { value: "College of Engineering" },
    });
    fireEvent.click(screen.getByLabelText("Inactive")); // checkbox toggle

    fireEvent.click(screen.getByText("Create"));

    /* axios POST happens */
    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    expect(axiosMock.history.post[0].params).toEqual({
      orgCode: "ENGR",
      orgTranslationShort: "Engineering",
      orgTranslation: "College of Engineering",
      inactive: true,
    });

    /* toast and redirect called */
    expect(mockToast).toHaveBeenCalledWith(
      "New organization created - orgCode: ENGR short: Engineering",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/ucsborganizations" });
  });
});
