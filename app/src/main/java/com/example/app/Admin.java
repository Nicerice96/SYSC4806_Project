package com.example.app;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Admin Class (Admin Entity) representing Admin user in the system
 */
@Entity
public class Admin {

    String password;
    String username;

    /**
     * Constructor
     */
    public Admin(){

    }
    /**
     * Param Constructor 
     * @param username
     * @param password
     */
    public Admin(String username, String password){
        this.username = username;
        this.password = password;
    }

    
    
    /** 
     * return Adming password
     * @return String
     */
    public String getPassword() {
        return this.password;
    }
    public boolean registrationValidation(String password) {
        // Check if username or password is null or empty
        if (
            password == null || password.trim().isEmpty()) {
            return false;
        }
    
        // LUDS Validation Criteria
        boolean hasLength = password.length() >= 8; // Minimum 8 characters
        boolean hasUppercase = password.matches(".*[A-Z].*");
        boolean hasLowercase = password.matches(".*[a-z].*");
        boolean hasDigit = password.matches(".*\\d.*");
        boolean hasSpecialChar = password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*");
    
        // Return true only if ALL criteria are met
        return hasLength && 
               hasUppercase && 
               hasLowercase && 
               hasDigit && 
               hasSpecialChar;
    }
    
    /** 
     * set Admin Password
     * @param password
     */
    public boolean setPassword(String password) {
        if (registrationValidation(password)){
            this.password = password;
            return true;
        }
        else{
            System.out.println("Requires LUDS...");
            return false;
        }
    }

    
    /** 
     * return Admin user
     * @return String
     */
    public String getUsername() {
        return this.username;
    }
    /**
     * set Admin user
     * @param username
     */
    public void setUsername(String username) {
        this.username = username;
    }
    /**
     * Admin Id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long adminId;

    /**
     * return Admin id
     * @return
     */
    public Long getAdminId() {
        return this.adminId;
    }
    /**
     * set Admin id
     * @param adminId
     */
    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }
    
}
