package com.bornaboyafraz.opportunityos.controller;

import com.bornaboyafraz.opportunityos.model.Opportunity;
import com.bornaboyafraz.opportunityos.repository.OpportunityRepository;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OpportunityController {

    private final OpportunityRepository repository;

    public OpportunityController(OpportunityRepository repository) {
        this.repository = repository;
    }

    // Read all — the logged-in user's opportunities, optionally filtered by status and/or a search term
    @GetMapping("/opportunities")
    public List<Opportunity> getOpportunities(Principal principal,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return repository.findByOwner(principal.getName()).stream()
                .filter(o -> status == null || status.isBlank() || status.equalsIgnoreCase(o.getStatus()))
                .filter(o -> search == null || search.isBlank()
                        || containsIgnoreCase(o.getCompany(), search)
                        || containsIgnoreCase(o.getPosition(), search))
                .toList();
    }

    private boolean containsIgnoreCase(String value, String search) {
        return value != null && value.toLowerCase().contains(search.toLowerCase());
    }

    // Stats — count of the user's opportunities grouped by status (for the dashboard)
    @GetMapping("/opportunities/stats")
    public Map<String, Long> stats(Principal principal) {
        return repository.findByOwner(principal.getName()).stream()
                .collect(Collectors.groupingBy(Opportunity::getStatus, Collectors.counting()));
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
