package com.bornaboyafraz.opportunityos.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
public class Opportunity {
    
    // Variables
    @NotBlank
    private String company;
    
    @NotBlank
    private String position;
    
    @NotBlank
    private String status;
    
    private String link;
    
    @NotNull
    private LocalDate deadline;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String owner;

    @Column(length = 2000)
    private String notes;

    // Functions
    public void printl(Object massage){
        System.out.println(massage);
    }

    public void print(Object massage){
        System.out.print(massage);
    }


    // getters
    public String getCompany(){
        return company;
    }

    public String getPosition(){
        return position;
    }

    public String getLink(){
        return link;
    }

    public String getStatus(){
        return status;
    }

    public String getOwner(){
        return owner;
    }

    public Long getId(){
        return id;
    }

    public LocalDate getDeadline(){
        return deadline;
    }

    public String getNotes(){
        return notes;
    }

    //Setter
    public void setId(Long id){
        this.id = id;
    }

    public void setOwner(String owner){
        this.owner = owner;
    }

    public void setNotes(String notes){
        this.notes = notes;
    }

    public void setCompany(String company){
        this.company = company;
    }

    public void setPosition(String position){
        this.position = position;
    }

    public void setStatus(String status){
        this.status = status;
    }

    public void setLink(String link){
        this.link = link;
    }

    public void setDeadline(LocalDate deadline){
        this.deadline = deadline;
    }

    
    // Constructor
    public Opportunity(String company, String position, String status, LocalDate deadline, String link){
        this.company = company;
        this.position = position;
        this.status = status;
        this.deadline = deadline;
        this.link = link;

    }


    public Opportunity(){
    }
    
    // public void describe(){ // a function to describe the positions fully(Not needed for now!)
    //     printl(company+ " company || "+ position + " position ||" + status + " status ||" + deadline + " deadline");
    // }

}
