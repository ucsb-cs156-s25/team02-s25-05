package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBOrganizations;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationsRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.assertEquals;

@WebMvcTest(controllers = UCSBOrganizationsController.class)
@Import(TestConfig.class)
public class UCSBOrganizationsControllerTests extends ControllerTestCase {

    @MockBean
    UCSBOrganizationsRepository ucsbOrganizationsRepository;

    @MockBean
    UserRepository userRepository;

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
        mockMvc.perform(get("/api/ucsborganizations/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void logged_in_users_can_get_all() throws Exception {
        mockMvc.perform(get("/api/ucsborganizations/all"))
                .andExpect(status().isOk());
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_get_all_returns_list() throws Exception {
        UCSBOrganizations org1 = UCSBOrganizations.builder()
                .orgCode("ABC123")
                .orgTranslationShort("Short1")
                .orgTranslation("Translation1")
                .inactive(false)
                .build();
        UCSBOrganizations org2 = UCSBOrganizations.builder()
                .orgCode("DEF456")
                .orgTranslationShort("Short2")
                .orgTranslation("Translation2")
                .inactive(true)
                .build();

        ArrayList<UCSBOrganizations> expectedOrgs = new ArrayList<>(Arrays.asList(org1, org2));
        when(ucsbOrganizationsRepository.findAll()).thenReturn(expectedOrgs);

        MvcResult response = mockMvc.perform(get("/api/ucsborganizations/all"))
                .andExpect(status().isOk())
                .andReturn();

        verify(ucsbOrganizationsRepository, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expectedOrgs);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_get_by_id_found() throws Exception {
        UCSBOrganizations org = UCSBOrganizations.builder()
                .orgCode("foo")
                .orgTranslationShort("Foo")
                .orgTranslation("FooBar")
                .inactive(false)
                .build();

        when(ucsbOrganizationsRepository.findById(eq("foo")))
            .thenReturn(Optional.of(org));

        MvcResult result = mockMvc.perform(get("/api/ucsborganizations?orgCode=foo"))
            .andExpect(status().isOk())
            .andReturn();

        verify(ucsbOrganizationsRepository, times(1)).findById("foo");
        assertEquals(
            mapper.writeValueAsString(org),
            result.getResponse().getContentAsString()
        );
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void test_get_by_id_not_found() throws Exception {
        when(ucsbOrganizationsRepository.findById(eq("bar")))
            .thenReturn(Optional.empty());

        MvcResult result = mockMvc.perform(get("/api/ucsborganizations?orgCode=bar"))
            .andExpect(status().isNotFound())
            .andReturn();

        Map<String, Object> json = responseToJson(result);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("UCSBOrganizations with id bar not found", json.get("message"));
    }

    @WithMockUser(roles = {"ADMIN", "USER"})
    @Test
    public void admin_can_post_new_organization() throws Exception {
        UCSBOrganizations org = UCSBOrganizations.builder()
                .orgCode("sky")
                .orgTranslationShort("skyShort")
                .orgTranslation("skydiving")
                .inactive(false)
                .build();

        when(ucsbOrganizationsRepository.save(eq(org))).thenReturn(org);

        MvcResult response = mockMvc.perform(
                post("/api/ucsborganizations/post?orgCode=sky&orgTranslationShort=skyShort&orgTranslation=skydiving&inactive=false")
                        .with(csrf())
        )
        .andExpect(status().isOk())
        .andReturn();

        verify(ucsbOrganizationsRepository, times(1)).save(org);
        assertEquals(mapper.writeValueAsString(org), response.getResponse().getContentAsString());
    }

    @WithMockUser(roles = {"ADMIN", "USER"})
    @Test
    public void admin_can_edit_an_existing_org() throws Exception {
        UCSBOrganizations orig = UCSBOrganizations.builder()
                .orgCode("foo")
                .orgTranslationShort("Short")
                .orgTranslation("Trans")
                .inactive(false)
                .build();

        UCSBOrganizations edited = UCSBOrganizations.builder()
                .orgCode("foo")
                .orgTranslationShort("ShortE")
                .orgTranslation("TransE")
                .inactive(true)
                .build();

        String requestBody = mapper.writeValueAsString(edited);

        when(ucsbOrganizationsRepository.findById(eq("foo"))).thenReturn(Optional.of(orig));

        MvcResult response = mockMvc.perform(
                put("/api/ucsborganizations?orgCode=foo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf())
        )
        .andExpect(status().isOk())
        .andReturn();

        verify(ucsbOrganizationsRepository, times(1)).findById("foo");
        verify(ucsbOrganizationsRepository, times(1)).save(edited);
        assertEquals(requestBody, response.getResponse().getContentAsString());
    }

    @WithMockUser(roles = {"ADMIN", "USER"})
    @Test
    public void admin_cannot_edit_org_that_does_not_exist() throws Exception {
        UCSBOrganizations edited = UCSBOrganizations.builder()
                .orgCode("bar")
                .orgTranslationShort("Bar")
                .orgTranslation("BarFoo")
                .inactive(false)
                .build();

        String requestBody = mapper.writeValueAsString(edited);

        when(ucsbOrganizationsRepository.findById(eq("bar"))).thenReturn(Optional.empty());

        MvcResult response = mockMvc.perform(
                put("/api/ucsborganizations?orgCode=bar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf())
        )
        .andExpect(status().isNotFound())
        .andReturn();

        verify(ucsbOrganizationsRepository, times(1)).findById("bar");
        Map<String, Object> json = responseToJson(response);
        assertEquals("UCSBOrganizations with id bar not found", json.get("message"));
    }

    @WithMockUser(roles = {"ADMIN", "USER"})
    @Test
    public void admin_can_delete_an_org() throws Exception {
        UCSBOrganizations org = UCSBOrganizations.builder()
                .orgCode("foo")
                .orgTranslationShort("Foo")
                .orgTranslation("FooBar")
                .inactive(false)
                .build();

        when(ucsbOrganizationsRepository.findById("foo")).thenReturn(Optional.of(org));

        MvcResult response = mockMvc.perform(
                delete("/api/ucsborganizations?orgCode=foo")
                        .with(csrf())
        )
        .andExpect(status().isOk())
        .andReturn();

        verify(ucsbOrganizationsRepository, times(1)).findById("foo");
        verify(ucsbOrganizationsRepository, times(1)).delete(org);

        Map<String, Object> json = responseToJson(response);
        assertEquals("UCSBOrganizations with id foo deleted", json.get("message"));
    }

    @WithMockUser(roles = {"ADMIN", "USER"})
    @Test
    public void admin_cannot_delete_org_that_does_not_exist() throws Exception {
        when(ucsbOrganizationsRepository.findById("bar")).thenReturn(Optional.empty());

        MvcResult response = mockMvc.perform(
                delete("/api/ucsborganizations?orgCode=bar")
                        .with(csrf())
        )
        .andExpect(status().isNotFound())
        .andReturn();

        verify(ucsbOrganizationsRepository, times(1)).findById("bar");
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("UCSBOrganizations with id bar not found", json.get("message"));
    }
}

