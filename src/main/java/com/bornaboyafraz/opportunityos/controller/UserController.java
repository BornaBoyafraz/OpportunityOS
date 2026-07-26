package com.bornaboyafraz.opportunityos.controller;
import com.bornaboyafraz.opportunityos.model.User;
import com.bornaboyafraz.opportunityos.repository.UserRepository;
import jakarta.validation.Valid;
import java.util.Optional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class UserController {
    private final UserRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();


    public UserController(UserRepository repository){
        this.repository = repository;
    }

    @PostMapping("/register")
    public User register(@Valid @RequestBody User user) {

        user.setPassword(encoder.encode(user.getPassword()));
        return repository.save(user);
    }

    @PostMapping("login")
    public String login(@RequestBody User loginRequest) {
        
        Optional<User> found = repository.findByUsername(loginRequest.getUsername());

        if (found.isPresent() && encoder.matches(loginRequest.getPassword(), found.get().getPassword())){
            return "Login successful";
        }
        
        return "Invalid username or password";
    }
    
    
}
