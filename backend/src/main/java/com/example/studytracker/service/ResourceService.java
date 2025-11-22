package com.example.studytracker.service;

import com.example.studytracker.model.Resource;
import com.example.studytracker.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository repo;

    public ResourceService(ResourceRepository repo) {
        this.repo = repo;
    }

    public List<Resource> getAll() {
        return repo.findAll();
    }

    public Resource save(Resource r) {
        return repo.save(r);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}