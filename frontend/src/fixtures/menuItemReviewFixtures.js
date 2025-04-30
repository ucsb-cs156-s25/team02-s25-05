const menuItemReviewFixtures = {
  oneReview: {
    id: 1,
    itemId: 6,
    reviewerEmail: "cgaucho0@ucsb.edu",
    stars: 1,
    dateReviewed: "2022-01-02T12:00:00",
    comments: "single review",
  },
  threeReviews: [
    {
      id: 1,
      itemId: 7,
      reviewerEmail: "cgaucho1@ucsb.edu",
      stars: 3,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "first review",
    },
    {
      id: 2,
      itemId: 8,
      reviewerEmail: "cgaucho2@ucsb.edu",
      stars: 4,
      dateReviewed: "2022-04-03T12:00:00",
      comments: "second review",
    },
    {
      id: 3,
      itemId: 9,
      reviewerEmail: "cgaucho3@ucsb.edu",
      stars: 5,
      dateReviewed: "2022-07-04T12:00:00",
      comments: "third review",
    },
  ],
};

export { menuItemReviewFixtures };
