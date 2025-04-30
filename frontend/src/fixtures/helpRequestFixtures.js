const helpRequestFixtures = {
  oneHelpRequest: {
    id: 1,
    requesterEmail: "awin@ucsb.edu",
    teamId: "s25-05",
    tableOrBreakoutRoom: "table",
    requestTime: "2022-01-02T12:00:00",
    explanation: "I need help with my project",
    solved: false,
  },

  threeHelpRequests: [
    {
      id: 2,
      requesterEmail: "awin@ucsb.edu",
      teamId: "s25-06",
      tableOrBreakoutRoom: "BreakoutRoom",
      requestTime: "2022-02-02T12:00:00",
      explanation: "I need help with my assignment",
      solved: true,
    },

    {
      id: 3,
      requesterEmail: "awin@ucsb.edu",
      teamId: "s25-07",
      tableOrBreakoutRoom: "table",
      requestTime: "2022-03-02T12:00:00",
      explanation: "I need help with my exam",
      solved: true,
    },

    {
      id: 4,
      requesterEmail: "awin@ucsb.edu",
      teamId: "s25-08",
      tableOrBreakoutRoom: "BreakoutRoom",
      requestTime: "2022-04-02T12:00:00",
      explanation: "I need help with my program",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };
