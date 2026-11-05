package com.vetra.identity;

import com.vetra.common.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest req) {
        if (userRepository.existsByEmail(req.email().toLowerCase().trim())) {
            throw new AppException("Email already registered", HttpStatus.CONFLICT);
        }

        User user = new User(
            req.email().toLowerCase().trim(),
            passwordEncoder.encode(req.password()),
            req.fullName().trim()
        );

        user = userRepository.save(user);

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        return new AuthDtos.AuthResponse(accessToken, refreshToken, AuthDtos.UserDto.from(user));
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest req) {
        User user = userRepository.findByEmail(req.email().toLowerCase().trim())
            .orElseThrow(() -> new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        return new AuthDtos.AuthResponse(accessToken, refreshToken, AuthDtos.UserDto.from(user));
    }

    public AuthDtos.UserDto getCurrentUser(User user) {
        if (user == null) {
            throw new AppException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        return AuthDtos.UserDto.from(user);
    }
}
