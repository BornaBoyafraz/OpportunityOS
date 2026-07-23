package com.bornaboyafraz.opportunityos;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;



@RestController
public class OpportunityController {

    //the field
    private final OpportunityRepository repository;

    //the constructor
    public OpportunityController(OpportunityRepository repository){
        this.repository = repository;
    }

    // endpoint methods
    @GetMapping("/opportunities")
    public List<Opportunity> gOpportunities(){

        // Opportunity opp1 = new Opportunity("Google", "SWE Intern", "Applied", LocalDate.of(2026, 6, 20), "https://google.com/careers");
        // //Opportunity opp2 = new Opportunity("Amazon", "Backend Intern", "Interested", "Saturday");

        // List<Opportunity> opportunitiesList = List.of(opp1);
        return repository.findAll();
    }

    //Read one
    @GetMapping("/opportunities/{id}")
    public Opportunity geOpportunity(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }
    

    //Create
    @PostMapping("/opportunities")
    public Opportunity addOpportunity(@Valid @RequestBody Opportunity opportunity) {

        return repository.save(opportunity);
    }

    //update
    @PutMapping("opportunities/{id}")
    public Opportunity updateOpportunity(@PathVariable Long id,@Valid @RequestBody Opportunity updated) {

        updated.setId(id);
        return repository.save(updated);
    }

    //Delete
    @DeleteMapping("/opportunities/{id}")
    public void deleteOpportunity(@PathVariable long id){
        repository.deleteById(id);
    }



    
}
