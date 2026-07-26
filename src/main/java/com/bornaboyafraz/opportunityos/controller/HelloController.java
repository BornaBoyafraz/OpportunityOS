package com.bornaboyafraz.opportunityos.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class HelloController {
    @GetMapping("/hello")
    public String sayGreeting() {
        return "Hello!";
    }
    
}
