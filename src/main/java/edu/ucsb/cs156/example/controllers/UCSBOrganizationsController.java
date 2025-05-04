package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBOrganizations;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationsRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/ucsborganizations")
@Tag(name = "UCSBOrganizations")
public class UCSBOrganizationsController extends ApiController {

    @Autowired
    UCSBOrganizationsRepository ucsbOrganizationsRepository;

    @Operation(summary = "List all UCSB organizations")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBOrganizations> allOrganizations() {
        return ucsbOrganizationsRepository.findAll();
    }

    @Operation(summary = "Get a single UCSB organization by orgCode")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBOrganizations getOrganization(
        @Parameter(name="orgCode", description="orgCode of the UCSBOrganization")
        @RequestParam String orgCode
    ) {
        return ucsbOrganizationsRepository.findById(orgCode)
            .orElseThrow(() -> new EntityNotFoundException(UCSBOrganizations.class, orgCode));
    }

    @Operation(summary = "Create a new UCSB organization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBOrganizations createOrganization(
            @RequestParam String orgCode,
            @RequestParam String orgTranslationShort,
            @RequestParam String orgTranslation,
            @RequestParam boolean inactive
    ) {
        UCSBOrganizations org = UCSBOrganizations.builder()
                .orgCode(orgCode)
                .orgTranslationShort(orgTranslationShort)
                .orgTranslation(orgTranslation)
                .inactive(inactive)
                .build();
        return ucsbOrganizationsRepository.save(org);
    }

    @Operation(summary = "Update an existing UCSB organization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBOrganizations updateOrganization(
        @Parameter(name="orgCode", description="orgCode of the UCSBOrganization to update")
        @RequestParam String orgCode,
        @RequestBody @Valid UCSBOrganizations incoming
    ) {
        UCSBOrganizations org = ucsbOrganizationsRepository.findById(orgCode)
            .orElseThrow(() -> new EntityNotFoundException(UCSBOrganizations.class, orgCode));

        org.setOrgTranslationShort(incoming.getOrgTranslationShort());
        org.setOrgTranslation(incoming.getOrgTranslation());
        org.setInactive(incoming.getInactive());

        ucsbOrganizationsRepository.save(org);
        return org;
    }

    @Operation(summary = "Delete an existing UCSB organization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteOrganization(
        @Parameter(name="orgCode", description="orgCode of the UCSBOrganization to delete")
        @RequestParam String orgCode
    ) {
        UCSBOrganizations org = ucsbOrganizationsRepository.findById(orgCode)
            .orElseThrow(() -> new EntityNotFoundException(UCSBOrganizations.class, orgCode));

        ucsbOrganizationsRepository.delete(org);
        return genericMessage("UCSBOrganizations with id %s deleted".formatted(orgCode));
    }
}
