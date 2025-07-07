package com.orchids.service;

import com.orchids.dto.OrderItemResponse;
import com.orchids.dto.OrderItemRequest;
import java.util.List;

public interface OrderService {
    OrderItemResponse createOrder(OrderItemRequest request);
    OrderItemResponse getOrderById(String orderId);
    List<OrderItemResponse> getAllOrders();
    void deleteOrder(String orderId);
    OrderItemResponse updateOrder(String orderId, OrderItemRequest request);
    List<OrderItemResponse> getOrdersForCurrentUser();
}