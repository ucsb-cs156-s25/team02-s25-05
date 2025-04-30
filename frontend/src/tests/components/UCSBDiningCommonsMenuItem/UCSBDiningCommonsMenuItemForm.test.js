import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBDiningCommonsMenuItemForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByText(/Create/);
    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-name"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-station"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit"),
    ).toBeInTheDocument();
  });

  test("renders correctly when passing in a UCSBDiningCommonsMenuItem", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm
          initialContents={ucsbDiningCommonsMenuItemFixtures.oneItem}
        />
      </Router>,
    );
    await screen.findByTestId(/UCSBDiningCommonsMenuItemForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/UCSBDiningCommonsMenuItemForm-id/)).toHaveValue(
      "1",
    );
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByTestId(
      "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
    );
    const diningCommonsCode = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
    );
    const itemName = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
    const station = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
    const submitButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-submit",
    );

    fireEvent.change(diningCommonsCode, { target: { value: "bad-input" } });
    fireEvent.change(itemName, {
      target: {
        value: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
    });
    fireEvent.change(station, {
      target: {
        value: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
    });
    fireEvent.click(submitButton);

    await screen.findByText(/Select a dining commons./);
    // 2 max length errors for item name and station
    const errors = await screen.findAllByText(/Max length 30 characters/);
    expect(errors).toHaveLength(2);
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemForm-submit");
    const submitButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-submit",
    );

    fireEvent.click(submitButton);

    await screen.findByText(/Item name is required./);
    expect(screen.getByText(/Station is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId(
      "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
    );

    const diningCommonsCode = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
    );
    const itemName = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
    const station = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
    const submitButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-submit",
    );

    fireEvent.change(diningCommonsCode, { target: { value: "Portola" } });
    fireEvent.change(itemName, { target: { value: "cheeseburger" } });
    fireEvent.change(station, {
      target: { value: "entrees" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Select a dining commons./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Item name is required./),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Station is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Max length 30 characters/),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemForm-cancel");
    const cancelButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-cancel",
    );

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
