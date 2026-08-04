package com.bornaboyafraz.opportunityos.controller;

import com.bornaboyafraz.opportunityos.model.Opportunity;
import com.bornaboyafraz.opportunityos.repository.OpportunityRepository;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OpportunityController {

    private final OpportunityRepository repository;

    public OpportunityController(OpportunityRepository repository) {
        this.repository = repository;
    }

    // Read all — only the logged-in user's opportunities
    @GetMapping("/opportunities")
    public List<Opportunity> getOpportunities(Principal principal) {
        return repository.findByOwner(principal.getName());
    }

    // Read one — must belong to the logged-in user
    @GetMapping("/opportunities/{id}")
    public ResponseEntity<Opportunity> getOpportunity(@PathVariable Long id, Principal principal) {
        Optional<Opportunity> found = repository.findById(id);
        if (found.isEmpty() || !principal.getName().equals(found.get().getOwner())) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(found.get());
    }

    // Create — stamp the current user as owner
    @PostMapping("/opportunities")
    public Opportunity addOpportunity(@Valid @RequestBody Opportunity opportunity, Principal principal) {
        opportunity.setOwner(principal.getName());
        return repository.save(opportunity);
    }

    // Update — only if the current user owns it
    @PutMapping("/opportunities/{id}")
    public ResponseEntity<Opportunity> updateOpportunity(@PathVariable Long id,
            @Valid @RequestBody Opportunity updated, Principal principal) {
        Optional<Opportunity> existing = repository.findById(id);
        if (existing.isEmpty() || !principal.getName().equals(existing.get().getOwner())) {
            return ResponseEntity.notFound().build();
        }
        updated.setId(id);
        updated.setOwner(principal.getName());
        return ResponseEntity.ok(repository.save(updated));
    }

    // Delete — only if the current user owns it
    @DeleteMapping("/opportunities/{id}")
    public ResponseEntity<Void> deleteOpportunity(@PathVariable Long id, Principal principal) {
        Optional<Opportunity> existing = repository.findById(id);
        if (existing.isEmpty() || !principal.getName().equals(existing.get().getOwner())) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
