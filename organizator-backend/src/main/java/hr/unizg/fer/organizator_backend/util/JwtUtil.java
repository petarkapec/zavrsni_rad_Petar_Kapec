package hr.unizg.fer.organizator_backend.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private final String SECRET = "3f6ce51fa2a638e60f8acfe4c331e7d4f926e01f231ff90ad588ecf07e6e170700fbb4feede2f6896e0a72b33dc161d2008e3eecb441e865800f9c1353156cbcf2f897f802e3ce20f4e10ea9e470d12410eb51e7f78bba5ae7473cd89a8e8fcc9a343db543b81d5587f1c82acda61a6fc1d1311515dd957b765b28d6cf8adb572bc2567c8b560a20a82cfd5881a95e9842b564195ffd827edb07fa227ddb19f23e25bba3dcb0ba800ed022786379ba40013dc2ac4a96608299310376df170dccc9aaa492e132778c744fa800c8f567f564e6608e828aa539ce364b3908ae951c01ede562be2db50a6a79d8964aa81155d6d21a00d802ff9aa4efb4122e8387cc";

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(SignatureAlgorithm.HS256, SECRET)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername());
    }
}
