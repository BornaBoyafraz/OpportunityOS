package com.bornaboyafraz.opportunityos.repository;
import com.bornaboyafraz.opportunityos.model.Opportunity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {
    List<Opportunity> findByOwner(String owner);
}
