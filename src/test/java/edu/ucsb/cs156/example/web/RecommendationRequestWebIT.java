package edu.ucsb.cs156.example.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.time.LocalDateTime;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
    @Autowired
    RecommendationRequestRepository RecommendationRequestRepository;

    @Test
    public void admin_user_can_create_edit_delete_recommendationrequest() throws Exception {
        LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
        LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");
        RecommendationRequest RecommendationRequest1 = RecommendationRequest.builder()
        .requestorEmail("hienhuynh@ucsb.edu")
        .professorEmail("pconrad")
        .explanation("I need a recommendation letter")
        .dateRequested(ldt1)
        .dateNeeded(ldt2)
        .done(false)
        .build();
        setupUser(true);
        RecommendationRequestRepository.save(RecommendationRequest1);


        page.getByText("Recommendation Request").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requestorEmail")).hasText("hienhuynh@ucsb.edu");

        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requestorEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_restaurant() throws Exception {
        setupUser(false);

        page.getByText("Recommendation Request").click();

        assertThat(page.getByText("Create Recommendation Request")).not().isVisible();
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-name")).not().isVisible();
    }
}