import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBOrganizationEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationEditPage";

export default {
  title: "pages/UCSBOrganizations/UCSBOrganizationEditPage",
  component: UCSBOrganizationEditPage,
};

const Template = () => <UCSBOrganizationEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.userOnly, { status: 200 })
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither, { status: 200 })
    ),
    http.get("/api/ucsborganizations", () =>
      HttpResponse.json(
        {
          orgCode: "ENGR",
          orgTranslationShort: "Engineering",
          orgTranslation: "College of Engineering",
          inactive: false,
        },
        { status: 200 }
      )
    ),
    http.put("/api/ucsborganizations", (req) => {
      window.alert("PUT to " + req.url + " with body: " + req.body);
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
