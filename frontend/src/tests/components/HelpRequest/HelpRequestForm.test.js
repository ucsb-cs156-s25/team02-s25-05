import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HelpRequestForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["Requester Email", "Team Id","Table Or Breakout Room", "Request Time", "Explanation", "Solved"];
  const testId = "HelpRequestForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm initialContents={helpRequestFixtures.oneHelpRequest} />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-tableOrBreakoutRoom");
    const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const explanationField = screen.getByTestId("HelpRequestForm-explanation");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(tableOrBreakoutRoomField, { target: { value: "bad-input" } });
    fireEvent.change(requestTimeField, { target: { value: "bad-input" } });
    const longText = "a".repeat(256);
    fireEvent.change(explanationField, { target: { value: longText } });
    fireEvent.click(submitButton);

    await screen.findByText(/Value must be 'table' or 'breakoutroom'./);
    await screen.findByText(/Comments must be less than 255 characters./);

  });

  test("Correct Error messages on missing input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-submit");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Requester Email is required./);
    expect(screen.getByText(/TeamId is required./)).toBeInTheDocument();
    expect(screen.getByText(/Table Or Breakout Room is required./)).toBeInTheDocument();
    expect(screen.getByText(/Request Time is required./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <HelpRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-requesterEmail");

    const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
    const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
    const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const explanationField = screen.getByTestId("HelpRequestForm-explanation");
    const solvedField = screen.getByTestId("HelpRequestForm-solved");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(requesterEmailField, { target: { value: "awinz@ucsb.edu" } });
    fireEvent.change(teamIdField, { target: { value: "s25-06" } });
    fireEvent.change(tableOrBreakoutRoomField, { target: { value: "table" } });
    fireEvent.change(requestTimeField, {
      target: { value: "2024-01-02T12:00" },
    });
    fireEvent.change(explanationField, { target: { value: "Need help with something." } });
    fireEvent.click(solvedField)
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Value must be 'table' or 'breakoutroom'./),
      screen.queryByText(/Comments must be less than 255 characters./),
    ).not.toBeInTheDocument();
  });

    test.each([
    ["table", true],
    ["breakoutroom", true],
    [" table ", true], // Leading/trailing spaces
    [" breakoutroom ", true], // Leading/trailing spaces
    ["invalid", false],
    ["", false],
  ])("Validation for tableOrBreakoutRoom with input '%s'", async (input, isValid) => {
    const mockSubmitAction = jest.fn();
  
    render(
      <Router>
        <HelpRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );
  
    const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");
  
    fireEvent.change(tableOrBreakoutRoomField, { target: { value: input } });
    fireEvent.click(submitButton);
  
    if (isValid) {
      await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
      expect(
        screen.queryByText(/Value must be 'table' or 'breakoutroom'./),
      ).not.toBeInTheDocument();
    } else {
      await screen.findByText(/Value must be 'table' or 'breakoutroom'./);
      expect(mockSubmitAction).not.toHaveBeenCalled();
    }
  });
});
