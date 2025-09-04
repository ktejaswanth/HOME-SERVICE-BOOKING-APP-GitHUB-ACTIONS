package klu.controler;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import klu.model.UserManager;
import klu.model.Users;




@RestController
@RequestMapping("/users")
@CrossOrigin(origins="http://localhost:5173")
public class UsersController {
	
	@Autowired  
	UserManager UM;
	@PostMapping("/signUp")
	public String signUp(@RequestBody Users U) {
		return UM.addUser(U);
	}
	
	@GetMapping("/forgotpassword/{email}")
	  public String forgotpassword(@PathVariable("email") String emailid) {
	      return UM.recoverPassword(emailid);
	  }
	@PostMapping("/signin")
	public String sigIn(@RequestBody Users U) {
		
		return UM.validateCredentials(U.getEmail(), U.getPassword());
	}


	  @PostMapping("/getfullname")
	  public String getFullname(@RequestBody Map<String, String> data)
	  {
	    return UM.getFullname(data.get("csrid"));
	  }
	

}
