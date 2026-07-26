package com.bornaboyafraz.opportunityos;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class OpportunityTest {

    @Test
    void gettersReturnConstructorValues(){
        //Arrange + Act
        Opportunity opp = new Opportunity(
            "Google", "SWE Intern", "Applied",
            LocalDate.of(2026, 7, 20), "https://careers.google.com"
        );

        //Assert
        assertEquals("Google", opp.getCompany());
        assertEquals("SWE Intern", opp.getPosition());
        assertEquals("Applied", opp.getStatus());
        assertEquals(LocalDate.of(2026, 7, 20), opp.getDeadline());
        assertEquals("https://careers.google.com", opp.getLink());
    }

}
