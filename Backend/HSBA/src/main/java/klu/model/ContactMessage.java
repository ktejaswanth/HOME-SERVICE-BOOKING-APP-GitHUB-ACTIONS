package klu.model;

public class ContactMessage {
    private String name;
    private String email;
    private String message;

    // Default constructor (required for @RequestBody deserialization)
    public ContactMessage() {}

    // Getters
    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getMessage() {
        return message;
    }

    // Setters
    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
