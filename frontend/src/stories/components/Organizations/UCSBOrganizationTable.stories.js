import React from "react";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/UCSBOrganization/UCSBOrganizationTable",
  component: UCSBOrganizationTable,
};

const Template = (args) => <UCSBOrganizationTable {...args} />;

export const Empty = Template.bind({});
Empty.args = {
  ucsbOrganizations: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});
ThreeItemsOrdinaryUser.args = {
  ucsbOrganizations: ucsbOrganizationFixtures.threeOrganizations,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  ucsbOrganizations: ucsbOrganizationFixtures.threeOrganizations,
  currentUser: currentUserFixtures.adminUser,
};
ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsborganizations", () => {
      return HttpResponse.json(
        { message: "Organization deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
