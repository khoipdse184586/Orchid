package com.orchids.service;

import com.orchids.dto.OrchidRequest;
import com.orchids.dto.OrchidResponse;
import java.util.List;

public interface OrchidService {
    OrchidResponse createOrchid(OrchidRequest request);
    OrchidResponse updateOrchid(String orchidId, OrchidRequest request);
    void deleteOrchid(String orchidId);
    OrchidResponse getOrchidById(String orchidId);
    List<OrchidResponse> getAllOrchids();
    List<OrchidResponse> getOrchidsByCategory(String categoryId);
}