package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.ucsb.cs156.example.entities.UCSBOrganizations;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationsRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationIT {

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    @Autowired
    private UCSBOrganizationsRepository ucsbOrganizationsRepository;

    // AUTHORIZATION TESTS

    @Test
    public void api_ucsborganizations_all__logged_out__returns_403() throws Exception {
        mockMvc.perform(get("/api/ucsborganizations/all"))
                .andExpect(status().is(403)); // Forbidden
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_ucsborganizations_post__logged_in_user_without_admin_role__returns_403() throws Exception {
        mockMvc.perform(post("/api/ucsborganizations/post" +
                        "?orgCode=TESTCODE" +
                        "&orgTranslationShort=Test Short" +
                        "&orgTranslation=Test Translation" +
                        "&inactive=false")
                        .with(csrf()))
                .andExpect(status().is(403)); // Forbidden
    }

    // CRUD TESTS

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void api_ucsborganizations_post__admin_user_can_post_a_new_organization() throws Exception {
        // Arrange
        UCSBOrganizations expectedOrg = UCSBOrganizations.builder()
                .orgCode("ZPR")
                .orgTranslationShort("ZETA PHI RHO")
                .orgTranslation("ZETA PHI RHO Fraternity")
                .inactive(false)
                .build();

        // Act
        MvcResult response = mockMvc.perform(
                post("/api/ucsborganizations/post?orgCode=ZPR&orgTranslationShort=ZETA PHI RHO&orgTranslation=ZETA PHI RHO Fraternity&inactive=false")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // Assert response
        String responseString = response.getResponse().getContentAsString();
        UCSBOrganizations actualOrg = mapper.readValue(responseString, UCSBOrganizations.class);
        assertEquals(expectedOrg, actualOrg);

        // Assert database state
        Optional<UCSBOrganizations> dbOrgOptional = ucsbOrganizationsRepository.findById("ZPR");
        assertTrue(dbOrgOptional.isPresent(), "Organization should be found in the database");
        UCSBOrganizations dbOrg = dbOrgOptional.get();
        assertEquals(expectedOrg.getOrgCode(), dbOrg.getOrgCode());
        assertEquals(expectedOrg.getOrgTranslationShort(), dbOrg.getOrgTranslationShort());
        assertEquals(expectedOrg.getOrgTranslation(), dbOrg.getOrgTranslation());
        assertEquals(expectedOrg.getInactive(), dbOrg.getInactive());
    }


    @WithMockUser(roles = { "USER" })
    @Test
    public void api_ucsborganizations_get_single_org__logged_in_user_can_get_by_id_when_it_exists() throws Exception {
        // Arrange
        UCSBOrganizations org = UCSBOrganizations.builder()
                .orgCode("OSLI")
                .orgTranslationShort("Office of Student Life")
                .orgTranslation("Office of Student Life")
                .inactive(false)
                .build();
        ucsbOrganizationsRepository.save(org);

        // Act
        MvcResult response = mockMvc.perform(get("/api/ucsborganizations?orgCode=OSLI"))
                .andExpect(status().isOk()).andReturn();

        // Assert
        String expectedJson = mapper.writeValueAsString(org);
        String actualJson = response.getResponse().getContentAsString();
        assertEquals(expectedJson, actualJson);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_ucsborganizations_get_single_org__returns_404_not_found_when_id_does_not_exist() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/ucsborganizations?orgCode=NONEXISTENT"))
                .andExpect(status().isNotFound()); // Expecting 404
    }
}