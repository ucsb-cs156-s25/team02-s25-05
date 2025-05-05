import React from "react";
import RecommendationRequestTable from "main/components/RecommendationRequests/RecommendationRequestTable";
import { RecommendationRequestFixtures } from "fixtures/recommendationRequestsFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/RecommendationRequests/RecommendationRequestTable",
  component: RecommendationRequestTable,
};

const Template = (args) => {
  return <RecommendationRequestTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  recommendationrequests: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  recommendationrequests:
    RecommendationRequestFixtures.threeRecommendationRequest,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  recommendationrequests:
    RecommendationRequestFixtures.threeRecommendationRequest,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/recommendationrequest", () => {
      return HttpResponse.json(
        { message: "Recommendation request deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
