package com.bornaboyafraz.opportunityos;

public class Opportunity {
    
    // Variables
    String company, position, status;
    String deadline; // Will be changed


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

    public String getStatus(){
        return status;
    }
    
    public String getDeadline(){
        return deadline;
    }
    
    // Constructor
    public Opportunity(String company, String position, String status, String deadline){
        this.company = company;
        this.position = position;
        this.status = status;
        this.deadline = deadline;

    }
    public void describe(){ // a function to describe the positions fully
        printl(company+ " company || "+ position + " position ||" + status + " status ||" + deadline + " deadline");
    }





    // main function
    public static void main(String[] args) {
        
        Opportunity myOpportunity = new Opportunity("Linkdine", "Software Endineer", "Hiring", "Monday");
        myOpportunity.describe();

    }

}
