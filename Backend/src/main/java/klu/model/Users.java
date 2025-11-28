package klu.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class Users {

    @Column(name = "fullname", nullable = false)
    private String fullname;

    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "role", nullable = false)
    private int role; // 0 = user, 1 = admin

    @Column(name = "password", nullable = false)
    private String password;

    // Default constructor (required by JPA)
    public Users() {
    }

    // Parameterized constructor (optional, helpful for testing or seeding)
    public Users(String fullname, String email, int role, String password) {
        this.fullname = fullname;
        this.email = email;
        this.role = role;
        this.password = password;
    }

    // Getters and setters
    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // ToString for debugging
    @Override
    public String toString() {
        return "Users [fullname=" + fullname + ", email=" + email + ", role=" + role + ", password=" + password + "]";
    }
}
