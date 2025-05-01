import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("RecommendationRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Explanation")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /recommendationrequest", async () => {
    const queryClient = new QueryClient();

    const recommendationrequest = {
      id: 2,
      requestorEmail: "kevinlee@ucsb.edu",
      professorEmail: "zmatni@ucsb.edu",
      explanation: "Recommendation 1 ",
      dateRequested: "2025-04-30T05:50:50",
      dateNeeded: "2025-04-30T06:50:50",
      done: false,
    };

    axiosMock
      .onPost("/api/recommendationrequest/post")
      .reply(202, recommendationrequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requestor Email")).toBeInTheDocument();
    });

    const requestorEmailInput = screen.getByLabelText("Requestor Email");
    expect(requestorEmailInput).toBeInTheDocument();

    const professorEmailInput = screen.getByLabelText("Professor Email");
    expect(professorEmailInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const dateRequestedInput = screen.getByLabelText("Date Requested(in UTC)");
    expect(dateRequestedInput).toBeInTheDocument();

    const dateNeededInput = screen.getByLabelText("Date Needed(in UTC)");
    expect(dateNeededInput).toBeInTheDocument();

    const doneInput = screen.getByLabelText("Done");
    expect(doneInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(requestorEmailInput, {
      target: { value: "kevinlee@ucsb.edu" },
    });
    fireEvent.change(professorEmailInput, {
      target: { value: "zmatni@ucsb.edu" },
    });
    fireEvent.change(explanationInput, {
      target: { value: "Recommendation 1 " },
    });
    fireEvent.change(dateRequestedInput, {
      target: { value: "2025-04-30T05:50:50" },
    });
    fireEvent.change(dateNeededInput, {
      target: { value: "2025-04-30T06:50:50" },
    });
    fireEvent.change(doneInput, { target: { value: "false" } });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requestorEmail: "kevinlee@ucsb.edu",
      professorEmail: "zmatni@ucsb.edu",
      explanation: "Recommendation 1 ",
      dateRequested: "2025-04-30T05:50:50.000Z",
      dateNeeded: "2025-04-30T06:50:50.000Z",
      done: "false",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New recommendation request Created - id: 2 requestorEmail: kevinlee@ucsb.edu",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });
  });
});
