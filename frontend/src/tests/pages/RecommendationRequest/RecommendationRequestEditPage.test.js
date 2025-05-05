import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("RecommendationRequestEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationrequest", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Recommendation Request");
      expect(
        screen.queryByTestId("RecommendationRequest-explanation"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationrequest", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          requestorEmail: "kevinlee@ucsb.edu",
          professorEmail: "zmatni@ucsb.edu",
          explanation: "Recommendation 1 ",
          dateRequested: "2025-04-30T05:50:50",
          dateNeeded: "2025-04-30T06:50:50",
          done: false,
        });
      axiosMock.onPut("/api/recommendationrequest").reply(200, {
        id: 17,
        requestorEmail: "sauldiaz@ucsb.edu",
        professorEmail: "fgibou@ucsb.edu",
        explanation: "Recommendation 1 Edited ",
        dateRequested: "2025-04-30T06:50:50",
        dateNeeded: "2025-04-30T07:50:50",
        done: true,
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided, and changes when data is changed", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-id");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requestorEmailField = screen.getByTestId(
        "RecommendationRequestForm-requestorEmail",
      );
      const professorEmailField = screen.getByTestId(
        "RecommendationRequestForm-professorEmail",
      );
      const explanationField = screen.getByTestId(
        "RecommendationRequestForm-explanation",
      );
      const dateRequestedField = screen.getByTestId(
        "RecommendationRequestForm-dateRequested",
      );
      const dateNeededField = screen.getByTestId(
        "RecommendationRequestForm-dateNeeded",
      );
      const doneField = screen.getByTestId("RecommendationRequestForm-done");
      const submitButton = screen.getByTestId(
        "RecommendationRequestForm-submit",
      );

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(requestorEmailField).toBeInTheDocument();
      expect(requestorEmailField).toHaveValue("kevinlee@ucsb.edu");

      expect(professorEmailField).toBeInTheDocument();
      expect(professorEmailField).toHaveValue("zmatni@ucsb.edu");

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("Recommendation 1 ");

      expect(dateRequestedField).toBeInTheDocument();
      expect(dateRequestedField).toHaveValue("2025-04-30T05:50:50.000");

      expect(dateNeededField).toBeInTheDocument();
      expect(dateNeededField).toHaveValue("2025-04-30T06:50:50.000");

      expect(doneField).toBeInTheDocument();
      expect(doneField).toHaveValue("false");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requestorEmailField, {
        target: { value: "sauldiaz@ucsb.edu" },
      });
      fireEvent.change(professorEmailField, {
        target: { value: "fgibou@ucsb.edu" },
      });
      fireEvent.change(explanationField, {
        target: { value: "Recommendation 1 Edited " },
      });
      fireEvent.change(dateRequestedField, {
        target: { value: "2025-04-30T06:50:50.000" },
      });
      fireEvent.change(dateNeededField, {
        target: { value: "2025-04-30T07:50:50.000" },
      });
      fireEvent.change(doneField, {
        target: { value: true },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Recommendation Request Updated - id: 17 requestorEmail: sauldiaz@ucsb.edu",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requestorEmail: "sauldiaz@ucsb.edu",
          professorEmail: "fgibou@ucsb.edu",
          explanation: "Recommendation 1 Edited ",
          dateRequested: "2025-04-30T06:50:50.000",
          dateNeeded: "2025-04-30T07:50:50.000",
          done: "true",
        }),
      ); // posted object
    });
  });
});
