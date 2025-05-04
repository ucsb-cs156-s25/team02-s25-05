const RecommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 2,
    requestorEmail: "kevinlee@ucsb.edu",
    professorEmail: "zmatni@ucsb.edu",
    explanation: "Recommendation 1 ",
    dateRequested: "2025-04-30T05:50:50",
    dateNeeded: "2025-04-30T06:50:50",
    done: false,
  },
  threeRecommendationRequest: [
    {
      id: 2,
      requestorEmail: "kevinlee@ucsb.edu",
      professorEmail: "zmatni@ucsb.edu",
      explanation: "Recommendation 1 ",
      dateRequested: "2025-04-30T05:50:50",
      dateNeeded: "2025-04-30T06:50:50",
      done: false,
    },
    {
      id: 3,
      requestorEmail: "kevinlee@ucsb.edu",
      professorEmail: "zmatni@ucsb.edu",
      explanation: "Recommendation 2",
      dateRequested: "2025-05-30T05:50:50",
      dateNeeded: "2025-05-31T06:50:50",
      done: false,
    },
    {
      id: 4,
      requestorEmail: "sauldiaz@ucsb.edu",
      professorEmail: "fgibou@ucsb.edu",
      explanation: "Recommendation 3",
      dateRequested: "2026-05-30T05:50:50",
      dateNeeded: "2027-05-31T06:50:50",
      done: true,
    },
  ],
};

export { RecommendationRequestFixtures };
