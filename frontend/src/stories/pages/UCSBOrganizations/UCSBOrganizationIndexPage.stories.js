import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import { http, HttpResponse } from "msw";

import UCSBOrganizationIndexPage from "main/pages/UCSBOrganizations/UCSBOrganizationIndexPage";

export default {
  title: "pages/UCSBOrganizations/UCSBOrganizationIndexPage",
  component: UCSBOrganizationIndexPage,
};

const Template = () => <UCSBOrganizationIndexPage storybook={true} />;

/* -------- Empty list, ordinary user -------- */
export const Empty = Template.bind({});
Empty.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.userOnly)
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither)
    ),
    http.get("/api/ucsborganizations/all", () => HttpResponse.json([])),
  ],
};

/* -------- Three rows, ordinary user -------- */
export const ThreeItemsOrdinaryUser = Template.bind({});
ThreeItemsOrdinaryUser.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.userOnly)
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither)
    ),
    http.get("/api/ucsborganizations/all", () =>
      HttpResponse.json(ucsbOrganizationFixtures.threeOrganizations)
    ),
  ],
};

/* -------- Three rows, admin user -------- */
export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.adminUser)
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither)
    ),
    http.get("/api/ucsborganizations/all", () =>
      HttpResponse.json(ucsbOrganizationFixtures.threeOrganizations)
    ),
    http.delete("/api/ucsborganizations", () =>
      HttpResponse.json(
        { message: "Organization deleted successfully" },
        { status: 200 }
      )
    ),
  ],
};
