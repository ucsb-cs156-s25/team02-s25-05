import React from "react";

import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
// Make sure the import path is correct for your project structure
import { ucsbOrganizationFixtures } from "../../../fixtures/ucsbOrganizationFixtures";

export default {
  title: "components/UCSBOrganization/UCSBOrganizationForm",
  component: UCSBOrganizationForm,
};

const Template = (args) => {
  // Keep Router wrapper if needed, otherwise remove
  return <UCSBOrganizationForm {...args} />;
};

export const Create = Template.bind({});
Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});
Update.args = {
  initialContents: ucsbOrganizationFixtures.oneOrganization[0],
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
