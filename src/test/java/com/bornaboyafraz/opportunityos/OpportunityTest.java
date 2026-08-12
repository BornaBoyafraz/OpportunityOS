package com.bornaboyafraz.opportunityos;
import com.bornaboyafraz.opportunityos.model.Opportunity;

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

    @Test
    void settersUpdateAllFields(){
        //Arrange
        Opportunity opp = new Opportunity();

        //Act
        opp.setCompany("OpenAI");
        opp.setPosition("Research Scholar");
        opp.setStatus("Interview");
        opp.setDeadline(LocalDate.of(2026, 9, 1));
        opp.setLink("https://openai.com/careers");
        opp.setNotes("Prepare a systems-design story");
        opp.setOwner("borna");
        opp.setId(42L);

        //Assert
        assertEquals("OpenAI", opp.getCompany());
        assertEquals("Research Scholar", opp.getPosition());
        assertEquals("Interview", opp.getStatus());
        assertEquals(LocalDate.of(2026, 9, 1), opp.getDeadline());
        assertEquals("https://openai.com/careers", opp.getLink());
        assertEquals("Prepare a systems-design story", opp.getNotes());
        assertEquals("borna", opp.getOwner());
        assertEquals(42L, opp.getId());
    }

}
