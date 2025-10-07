package com.project.evrental.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class JwtAuthConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = extractAuthorities(jwt);
        return new JwtAuthenticationToken(jwt, authorities, getPrincipalName(jwt));
    }

    private String getPrincipalName(Jwt jwt) {
        return jwt.getClaimAsString("email");
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        List<String> groups = jwt.getClaimAsStringList("cognito:groups");

        if (groups == null) {
            return List.of();
        }

        return groups.stream()
                .map(group -> "ROLE_" + group.toUpperCase())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}
