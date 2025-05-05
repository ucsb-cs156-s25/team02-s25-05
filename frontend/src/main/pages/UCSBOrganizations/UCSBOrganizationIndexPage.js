import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationTable from "main/components/UCSBOrganizations/UCSBOrganizationTable";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { Button } from "react-bootstrap";

export default function UCSBOrganizationIndexPage() {
  const currentUser = useCurrentUser();

  /* -------------------- load data -------------------- */
  const {
    data: ucsbOrganizations,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all
    ["/api/ucsborganizations/all"],
    { method: "GET", url: "/api/ucsborganizations/all" },
    // Stryker disable next-line all
    [] /* default empty list */,
  );

  /* -------------------- Create button ---------------- */
  const createButton = () =>
    hasRole(currentUser, "ROLE_ADMIN") && (
      <Button
        variant="primary"
        href="/ucsborganizations/create"
        style={{ float: "right" }}
      >
        Create UCSB Organization
      </Button>
    );

  /* -------------------- render ----------------------- */
  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>UCSB Organizations</h1>
        <UCSBOrganizationTable
          ucsbOrganizations={ucsbOrganizations}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
