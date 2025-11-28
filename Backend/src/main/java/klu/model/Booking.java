package klu.model;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Booking {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String name;
	    private String phone;
	    private LocalDate date;
	    private LocalTime time;
	    private String service;
	    private String workers;
	    private double price;
	    private double appFee;
	    private double total;
	    private String payment;
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getPhone() {
			return phone;
		}
		public void setPhone(String phone) {
			this.phone = phone;
		}
		public LocalDate getDate() {
			return date;
		}
		public void setDate(LocalDate date) {
			this.date = date;
		}
		public LocalTime getTime() {
			return time;
		}
		public void setTime(LocalTime time) {
			this.time = time;
		}
		public String getService() {
			return service;
		}
		public void setService(String service) {
			this.service = service;
		}
		public String getWorkers() {
			return workers;
		}
		public void setWorkers(String workers) {
			this.workers = workers;
		}
		public double getPrice() {
			return price;
		}
		public void setPrice(double price) {
			this.price = price;
		}
		public double getAppFee() {
			return appFee;
		}
		public void setAppFee(double appFee) {
			this.appFee = appFee;
		}
		public double getTotal() {
			return total;
		}
		public void setTotal(double total) {
			this.total = total;
		}
		public String getPayment() {
			return payment;
		}
		public void setPayment(String payment) {
			this.payment = payment;
		}
		@Override
		public String toString() {
			return "Booking [id=" + id + ", name=" + name + ", phone=" + phone + ", date=" + date + ", time=" + time
					+ ", service=" + service + ", workers=" + workers + ", price=" + price + ", appFee=" + appFee
					+ ", total=" + total + ", payment=" + payment + "]";
		}


}
