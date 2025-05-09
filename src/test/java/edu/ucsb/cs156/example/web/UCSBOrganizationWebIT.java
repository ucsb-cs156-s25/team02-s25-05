package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationWebIT extends WebTestCase {

    @Test
    public void admin_user_can_create_a_new_organization() throws Exception {
        setupUser(true);

        page.getByText("UCSB Organizations").click();
        page.getByTestId("UCSBOrganizationPage-Create-Button").click();

        assertThat(page.getByText("Create New UCSB Organization")).isVisible();
        page.getByTestId("UCSBOrganizationForm-orgCode").fill("SKY");
        page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("Skydiving Club");
        page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("Skydiving Club at UCSB");
        page.getByTestId("UCSBOrganizationForm-submit").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).hasText("SKY");
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslationShort")).hasText("Skydiving Club");
    }

    @Test
    public void regular_user_cannot_create_organization_via_ui() throws Exception {
        setupUser(false);

        page.getByText("UCSB Organizations").click();

        assertThat(page.getByTestId("UCSBOrganizationPage-Create-Button")).not().isVisible();
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }
}
