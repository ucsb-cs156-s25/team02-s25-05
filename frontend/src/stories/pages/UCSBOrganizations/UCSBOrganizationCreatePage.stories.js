import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBOrganizationCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationCreatePage";

export default {
  title: "pages/UCSBOrganizations/UCSBOrganizationCreatePage",
  component: UCSBOrganizationCreatePage,
};

const Template = () => <UCSBOrganizationCreatePage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.adminUser, { status: 200 }),
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither, { status: 200 }),
    ),
    http.post("/api/ucsborganizations/post", () =>
      HttpResponse.json({}, { status: 200 }),
    ),
  ],
};
