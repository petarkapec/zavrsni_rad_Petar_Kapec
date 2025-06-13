package hr.unizg.fer.organizator_backend.controllers;


import hr.unizg.fer.organizator_backend.domain.Korisnik;
import hr.unizg.fer.organizator_backend.model.AuthRequestDTO;
import hr.unizg.fer.organizator_backend.model.KorisnikLoginDTO;
import hr.unizg.fer.organizator_backend.model.RegisterRequestDTO;
import hr.unizg.fer.organizator_backend.repos.KorisnikRepository;
import hr.unizg.fer.organizator_backend.service.UserDetailsServiceImpl;
import hr.unizg.fer.organizator_backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // ili "http://localhost:3000"
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private KorisnikRepository korisnikRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO request) {
        Optional<Korisnik> korisnikOpt = korisnikRepository.findByUsername(request.getUsername());
        if (korisnikOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        Korisnik korisnik = korisnikOpt.get();

        if (!korisnik.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                korisnik.getUsername(),
                korisnik.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + korisnik.getUloga()))
        );

        String token = jwtUtil.generateToken(userDetails);

        KorisnikLoginDTO korisnikDTO = new KorisnikLoginDTO(korisnik);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", korisnikDTO
        ));
    }



    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO request) {
        if (korisnikRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken");
        }

        Korisnik korisnik = new Korisnik();
        korisnik.setUsername(request.getUsername());
        korisnik.setPassword(request.getPassword()); // direktno, bez enkripcije
        korisnik.setIme(request.getIme());
        korisnik.setPrezime(request.getPrezime());
        korisnik.setEmail(request.getEmail());
        korisnik.setUloga(request.getUloga());

        korisnikRepository.save(korisnik);

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                korisnik.getUsername(), korisnik.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + korisnik.getUloga()))
        );
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(Map.of("token", token, "user", korisnik));
    }


    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        String username = authentication.getName();
        Korisnik korisnik = korisnikRepository.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(korisnik);
    }
}
