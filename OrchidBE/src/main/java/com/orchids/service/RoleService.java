package com.orchids.service;

import com.orchids.pojo.Role;

import java.util.List;

public interface RoleService {
   public Role getRole(String id);
   public Role insertRole(Role role);
   public Role updateRole(Role role);
    public void deleteRole(String id);
    public List<Role> getAllRoles();
}