package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.repositories.UCSBDateRepository;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.ZonedDateTime;

@WebMvcTest(controllers = RecommendationRequestController.class)
@Import(TestConfig.class)
public class RecommendationRequestControllerTests extends ControllerTestCase{
    @MockBean
    RecommendationRequestRepository recommendationRequestRepository;

    @MockBean
    UserRepository userRepository;



     @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/recommendationrequest/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/recommendationrequest/all"))
                                .andExpect(status().is(200)); // logged
        }
        
        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/recommendationrequest/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/recommendationrequest/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_recommendationrequests() throws Exception {

                // arrange
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


                              
                ArrayList<RecommendationRequest> expectedRecommendationRequests = new ArrayList<>();
                expectedRecommendationRequests.add(RecommendationRequest1);

                when(recommendationRequestRepository.findAll()).thenReturn(expectedRecommendationRequests);

                // act
                MvcResult response = mockMvc.perform(get("/api/recommendationrequest/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(recommendationRequestRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedRecommendationRequests);

                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_recommendationrequest() throws Exception {
                // arrange

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
                
                when(recommendationRequestRepository.save(eq(RecommendationRequest1))).thenReturn(RecommendationRequest1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/recommendationrequest/post?requestorEmail=hienhuynh@ucsb.edu&professorEmail=pconrad&explanation=I need a recommendation letter&dateRequested=2022-01-03T00:00:00&dateNeeded=2022-03-11T00:00:00&done=false")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).save(eq(RecommendationRequest1));
                String expectedJson = mapper.writeValueAsString(RecommendationRequest1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

         @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_done_recommendationrequest() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");


                RecommendationRequest RecommendationRequest1 = RecommendationRequest.builder()
                .requestorEmail("hienhuynh@ucsb.edu")
                .professorEmail("pconrad")
                .explanation("I need a recommendation letter")
                .dateRequested(ldt1)
                .dateNeeded(ldt2)
                .done(true)
                .build();
                
                when(recommendationRequestRepository.save(eq(RecommendationRequest1))).thenReturn(RecommendationRequest1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/recommendationrequest/post?requestorEmail=hienhuynh@ucsb.edu&professorEmail=pconrad&explanation=I need a recommendation letter&dateRequested=2022-01-03T00:00:00&dateNeeded=2022-03-11T00:00:00&done=true")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).save(eq(RecommendationRequest1));
                String expectedJson = mapper.writeValueAsString(RecommendationRequest1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }
        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/recommendationrequest?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_exist() throws Exception {

                // arrange
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

                when(recommendationRequestRepository.findById(eq(7L))).thenReturn(Optional.of(RecommendationRequest1));

                // act
                MvcResult response = mockMvc.perform(get("/api/recommendationrequest?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(recommendationRequestRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(RecommendationRequest1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
                
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange
             when(recommendationRequestRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/recommendationrequest?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(recommendationRequestRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("RecommendationRequest with id 7 not found", json.get("message"));
                
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_recommendationrequest() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2023-01-03T00:00:00");
                RecommendationRequest RecommendationRequest1 = RecommendationRequest.builder()
                .requestorEmail("hienhuynh@ucsb.edu")
                .professorEmail("pconrad@ucsb.edu")
                .explanation("I need a recommendation letter")
                .dateRequested(ldt1)
                .dateNeeded(ldt2)
                .done(false)
                .build();

                LocalDateTime ldt3 = LocalDateTime.parse("2022-01-03T01:00:00");
                LocalDateTime ldt4 = LocalDateTime.parse("2023-01-03T02:00:00");


                RecommendationRequest editedRecommendationRequest = RecommendationRequest.builder()
                .requestorEmail("kevinlee@ucsb.edu")
                .professorEmail("zmatni@ucsb.edu")
                .explanation("I don't need a recommendation letter")
                .dateRequested(ldt3)
                .dateNeeded(ldt4)
                .done(true)
                .build();

               

                String requestBody = mapper.writeValueAsString(editedRecommendationRequest);

                when(recommendationRequestRepository.findById(eq(67L))).thenReturn(Optional.of(RecommendationRequest1));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/recommendationrequest?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).findById(67L);
                verify(recommendationRequestRepository, times(1)).save(editedRecommendationRequest); 
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_recommendationrequest_that_does_not_exist() throws Exception {
                // arrange


                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2023-01-03T00:00:00");
                RecommendationRequest RecommendationRequest1 = RecommendationRequest.builder()
                .requestorEmail("hienhuynh@ucsb.edu")
                .professorEmail("pconrad@ucsb.edu")
                .explanation("I need a recommendation letter")
                .dateRequested(ldt1)
                .dateNeeded(ldt2)
                .done(false)
                .build();

                String requestBody = mapper.writeValueAsString(RecommendationRequest1);

                when(recommendationRequestRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/recommendationrequest?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("RecommendationRequest with id 67 not found", json.get("message"));

        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_recommendationrequest() throws Exception {
                // arrange

                
                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2023-01-03T00:00:00");
                RecommendationRequest RecommendationRequest1 = RecommendationRequest.builder()
                .requestorEmail("hienhuynh@ucsb.edu")
                .professorEmail("pconrad@ucsb.edu")
                .explanation("I need a recommendation letter")
                .dateRequested(ldt1)
                .dateNeeded(ldt2)
                .done(false)
                .build();


                when(recommendationRequestRepository.findById(eq(15L))).thenReturn(Optional.of(RecommendationRequest1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/recommendationrequest?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).findById(15L);
                verify(recommendationRequestRepository, times(1)).delete(eq(RecommendationRequest1));

                Map<String, Object> json = responseToJson(response);
                assertEquals("RecommendationRequest with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_recommendationrequest_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(recommendationRequestRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/recommendationrequest?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("RecommendationRequest with id 15 not found", json.get("message"));
        }

}
