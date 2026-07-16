package com.bornaboyafraz.opportunityos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication (exclude = {DataSourceAutoConfiguration.class})
public class OpportunityosApplication {

	public static void main(String[] args) {
		SpringApplication.run(OpportunityosApplication.class, args);
	}

}
