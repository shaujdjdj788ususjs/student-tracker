package com.example.studytracker.repository;

import com.example.studytracker.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    // IMPORTANT: Needed for GET /api/resources/{course}
    List<Resource> findByCourse(String course);

}
