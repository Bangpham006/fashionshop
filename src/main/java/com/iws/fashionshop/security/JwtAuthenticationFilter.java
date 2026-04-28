package com.iws.fashionshop.security;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // 1. Lấy JWT từ request header
            String jwt = getJwtFromRequest(request);

            // 2. Chỉ xử lý xác thực NẾU có token gửi lên và token đó hợp lệ
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {

                // Lấy Username từ JWT
                String username = tokenProvider.getUsernameFromJWT(jwt);

                /* * QUAN TRỌNG: Lấy danh sách quyền (Authorities/Roles) từ Claims trong Token.
                 * Trước đây bạn dùng Collections.emptyList(), dẫn đến lỗi 403 
                 * vì Spring Security nghĩ User này không có quyền gì.
                 */
                List<GrantedAuthority> authorities = tokenProvider.getAuthoritiesFromJWT(jwt);

                // 3. Tạo đối tượng xác thực với đầy đủ Username và Authorities
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        authorities // Nạp danh sách ROLE_ADMIN hoặc ADMIN vào đây
                );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 4. Lưu vào SecurityContext để các API sau (như /api/variants) kiểm tra được quyền
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (Exception ex) {
            // Log lỗi nếu quá trình giải mã token hoặc nạp quyền gặp sự cố
            logger.error("Could not set user authentication in security context", ex);
        }

        // Luôn gọi filterChain để request tiếp tục đi tới Controller
        filterChain.doFilter(request, response);
    }

    /**
     * Hàm hỗ trợ bóc tách chuỗi JWT từ Header Authorization
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
