package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.MenuItemReview;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * The MenuItemReviewRepository is a repository for MenuItemReview entities.
 */

@Repository
public interface MenuItemReviewRepository extends CrudRepository<MenuItemReview, Long> {
  /**
   * This method returns all MenuItemReview entities with a given itemId.
   * @param itemId id corresponding to the id of an entry in UCSBDiningCommonsMenuItems
   * @return all MenuItemReview entities with a given itemId
   */
  Iterable<MenuItemReview> findAllByItemId(long itemId);
  /**
   * This method returns all MenuItemReview entities with a given reviewerEmail.
   * @param reviewerEmail email of the author of the review.
   * @return all MenuItemReview entities with a given reviewerEmail
   */  
  Iterable<MenuItemReview> findAllByReviewerEmail(String reviewerEmail);
    /**
   * This method returns all MenuItemReview entities with a given stars.
   * @param stars star rating, from 0 to 5, of the review
   * @return all MenuItemReview entities with a given stars
   */  
  Iterable<MenuItemReview> findAllByStars(int stars);
}