package com.bornaboyafraz.opportunityos;

import java.time.LocalDate;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class OpportunityController {
    @GetMapping("/opportunities")
    public List<Opportunity> gOpportunities(){
        

        Opportunity opp1 = new Opportunity("Google", "SWE Intern", "Applied", LocalDate.of(2026, 6, 20), "https://google.com/careers");
        //Opportunity opp2 = new Opportunity("Amazon", "Backend Intern", "Interested", "Saturday");


        List<Opportunity> opportunitiesList = List.of(opp1);

        return opportunitiesList;
    }
    
}
